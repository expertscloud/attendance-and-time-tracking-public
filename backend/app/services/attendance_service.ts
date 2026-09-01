import { attendanceStatus } from '#enums/attendance_enum'
import Attendance from '#models/attendance'
import TimeEntry from '#models/time_entry'
import User from '#models/user'
import Project from '#models/project'
import { UserTypeEnum } from '#enums/user_type_enum'
import { DateTime } from 'luxon'
import {
  CheckOutInterface,
  PauseTimerInterface,
  ProjectActionInterface,
  SyncWorkedTimeValidatorInterface,
} from '#validators/attendance_validator'
import { userAttendanceQueryValidatorInterface } from '#validators/user_validator'
import { getSignedUrlByFilePath } from './file_service.js'
import { MINIMUM_WORKING_HOURS_IN_SECONDS, OFFLINE_THRESHOLD_IN_SEC } from '#config/services'

const saveAttendance = async (attendance: Attendance) => {
  await attendance.save()
  return attendance
}

export const getLastCheckInAttendanceByUserId = async (userId: number) => {
  const attendance = await Attendance.query()
    .where('user_id', userId)
    .orderBy('check_in_time', 'desc')
    .first()

  return attendance
}

export const getOpenTimeEntryByAttendanceId = async (attendanceId: number) => {
  return TimeEntry.query().where('attendance_id', attendanceId).whereNull('end_time').first()
}

export const hasRepeatedLowWorkingHours = async (userId: number): Promise<boolean> => {
  try {
    const attendances = await Attendance.query()
      .where('user_id', userId)
      .orderBy('check_in_time', 'desc')
      .limit(5)

    if (attendances?.[0]?.totalWorkingSeconds >= MINIMUM_WORKING_HOURS_IN_SECONDS) {
      return false
    }

    const lowHourCount = attendances.filter(
      (attendance) => attendance.totalWorkingSeconds < MINIMUM_WORKING_HOURS_IN_SECONDS
    ).length

    return lowHourCount >= 2
  } catch (error: any) {
    console.error('Error in hasRepeatedLowWorkingHours:', error)
    return false
  }
}

export const checkIn = async (userId: number, payload: ProjectActionInterface) => {
  const today = DateTime.now()
  const todayStart = today.startOf('day').toSQL({ includeOffset: false })!
  const todayEnd = today.endOf('day').toSQL({ includeOffset: false })!

  // Check if user already has an active attendance for today
  const existingAttendance = await Attendance.query()
    .where('user_id', userId)
    .where('created_at', '>=', todayStart)
    .where('created_at', '<=', todayEnd)
    .whereNull('check_out_time')
    .first()

  if (existingAttendance) {
    throw new Error('You have already checked in today. Please check out first.')
  }

  const isRepeatedLowWorkingHoursWarning = await hasRepeatedLowWorkingHours(userId)

  const attendance = await Attendance.create({
    userId,
    checkInTime: today,
    status: attendanceStatus.ACTIVE,
    totalWorkingSeconds: 0,
  })

  // Create initial work time entry
  await TimeEntry.create({
    attendanceId: attendance.id,
    type: 'work',
    startTime: attendance.checkInTime,
    projectId: payload.projectId,
    notes: payload.notes ?? null,
    isBillable: payload.isBillable,
  })

  return {
    ...attendance.serialize(),
    isRepeatedLowWorkingHoursWarning,
  }
}

export const checkOut = async (userId: number, payload: CheckOutInterface) => {
  const attendance = await getLastCheckInAttendanceByUserId(userId)

  if (!attendance || attendance.checkOutTime) {
    throw new Error('No active check-in found for today.')
  }

  const checkOutDateTime = DateTime.now()

  // End any active time entry
  const lastActivityEntry = await getOpenTimeEntryByAttendanceId(attendance.id)

  if (lastActivityEntry) {
    lastActivityEntry.endTime = checkOutDateTime
    await lastActivityEntry.save()
  }

  if (payload.workedSeconds) {
    attendance.totalWorkingSeconds = payload.workedSeconds
  }
  attendance.checkOutTime = checkOutDateTime
  attendance.status = attendanceStatus.COMPLETED

  return saveAttendance(attendance)
}

export const pauseTimer = async (userId: number, payload: PauseTimerInterface) => {
  const attendance = await getLastCheckInAttendanceByUserId(userId)

  if (!attendance || attendance.checkOutTime) {
    throw new Error('No active check-in found for today.')
  }

  const idleSeconds = Math.max(0, payload.idleSeconds ?? 0)
  const now = DateTime.now()

  // End current work time entry
  const lastActivityEntry = await getOpenTimeEntryByAttendanceId(attendance.id)

  // For auto-idle pause, work actually stopped `idleSeconds` ago — clamp so we
  // never go before the work entry's startTime.
  let pauseStartTime = now
  if (lastActivityEntry) {
    const workEndTime = idleSeconds > 0 ? now.minus({ seconds: idleSeconds }) : now
    lastActivityEntry.endTime = workEndTime
    pauseStartTime = workEndTime

    await lastActivityEntry.save()
  } else if (idleSeconds > 0) {
    pauseStartTime = now.minus({ seconds: idleSeconds })
  }

  await TimeEntry.create({
    attendanceId: attendance.id,
    type: idleSeconds > 0 ? 'away' : 'pause',
    startTime: pauseStartTime,
  })

  if (payload.workedSeconds) {
    attendance.totalWorkingSeconds = payload.workedSeconds - idleSeconds
  }
  attendance.status = attendanceStatus.PAUSED

  return saveAttendance(attendance)
}

export const resumeTimer = async (userId: number, payload: ProjectActionInterface) => {
  const attendance = await getLastCheckInAttendanceByUserId(userId)

  if (!attendance || attendance.checkOutTime) {
    throw new Error('No active check-in found for today.')
  }
  const activePauseEntry = await getOpenTimeEntryByAttendanceId(attendance.id)

  if (activePauseEntry) {
    activePauseEntry.endTime = DateTime.now()
    await activePauseEntry.save()
  }

  // Create new work entry
  await TimeEntry.create({
    attendanceId: attendance.id,
    type: 'work',
    startTime: DateTime.now(),
    notes: payload.notes ?? null,
    projectId: payload.projectId,
    isBillable: payload.isBillable,
  })

  attendance.status = attendanceStatus.ACTIVE

  return saveAttendance(attendance)
}

export const startNewTask = async (userId: number, payload: ProjectActionInterface) => {
  const attendance = await getLastCheckInAttendanceByUserId(userId)

  if (!attendance || attendance.checkOutTime) {
    throw new Error('No active check-in found for today.')
  }

  const lastActivityEntry = await getOpenTimeEntryByAttendanceId(attendance.id)

  const now = DateTime.now()

  if (lastActivityEntry) {
    lastActivityEntry.endTime = now
    await lastActivityEntry.save()
  }

  await TimeEntry.create({
    attendanceId: attendance.id,
    type: 'work',
    startTime: now,
    notes: payload.notes ?? null,
    projectId: payload.projectId,
    isBillable: payload.isBillable,
  })

  return saveAttendance(attendance)
}

export const getCurrentAttendance = async (userId: number) => {
  const attendance = await getLastCheckInAttendanceByUserId(userId)
  if (
    !attendance ||
    (!DateTime.now().hasSame(attendance.checkInTime, 'day') && attendance.checkOutTime)
  ) {
    return null
  }

  return attendance
}

export const syncWorkedTime = async (userId: number, payload: SyncWorkedTimeValidatorInterface) => {
  const attendance = await getLastCheckInAttendanceByUserId(userId)

  if (!attendance || attendance.checkOutTime) {
    throw new Error('No active check-in found for today.')
  }

  const activePauseEntry = await TimeEntry.query()
    .where('attendance_id', attendance.id)
    .whereIn('type', ['pause', 'away'])
    .whereNull('end_time')
    .first()

  if (activePauseEntry) {
    const now = DateTime.now()
    activePauseEntry.endTime = now
    await activePauseEntry.save()

    const lastWorkActivity = await getLastWorkActivity(userId)

    await TimeEntry.create({
      attendanceId: attendance.id,
      type: 'work',
      startTime: now,
      notes: lastWorkActivity?.notes ?? null,
      projectId: lastWorkActivity?.projectId ?? undefined,
    })
  }

  attendance.status = attendanceStatus.ACTIVE
  attendance.totalWorkingSeconds = payload.workedSeconds
  await attendance.save()
  return attendance
}

export const getRecentAttendances = async (userId: number, limit: number) => {
  try {
    return await Attendance.query()
      .where('user_id', userId)
      .whereNotNull('check_out_time')
      .orderBy('created_at', 'desc')
      .limit(limit)
  } catch (error: any) {
    throw new Error(`Error fetching recent attendances: ${error.message}`)
  }
}

export const getAllUsersAttendances = async (payload: userAttendanceQueryValidatorInterface) => {
  try {
    const start = DateTime.fromJSDate(payload.startDate)
      .startOf('day')
      .toSQL({ includeOffset: false })!
    const end = DateTime.fromJSDate(payload.endDate).endOf('day').toSQL({ includeOffset: false })!

    return await User.query()
      .whereIn('type', [UserTypeEnum.user, UserTypeEnum.admin])
      .where('is_active', true)
      .preload('attendances', (q) =>
        q.where('created_at', '>=', start).where('created_at', '<=', end)
      )
      .preload('leaves', (q) => q.where('date', '>=', start).where('date', '<=', end))
  } catch (error: any) {
    throw new Error(`Error fetching users attendances: ${error.message}`)
  }
}

// To check status of fellows
export const getUsersWithTodayAttendance = async () => {
  try {
    const now = DateTime.now()
    const todayStart = now.startOf('day').toSQL({ includeOffset: false })!
    const todayEnd = now.endOf('day').toSQL({ includeOffset: false })!

    const users = await User.query()
      .whereIn('type', [UserTypeEnum.user, UserTypeEnum.admin])
      .where('is_active', true)
      .preload('attendances', (q) =>
        q.where('created_at', '>=', todayStart).where('created_at', '<=', todayEnd)
      )
      .preload('userDetail', (q) => q.preload('profileFile'))

    return Promise.all(
      users.map(async (user) => {
        const profileSignedUrl = await getSignedUrlByFilePath(
          user.userDetail?.profileFile?.filePath ?? null
        )

        return {
          ...user.serialize(),
          profileSignedUrl,
        }
      })
    )
  } catch (error: any) {
    throw new Error(`Error fetching users with today attendance: ${error.message}`)
  }
}

export const getAttendanceStats = async (
  userId: number,
  startDate?: DateTime,
  endDate?: DateTime
) => {
  const query = Attendance.query().where('user_id', userId).whereNotNull('check_out_time')
  if (startDate) {
    query.where('created_at', '>=', startDate.startOf('day').toSQL({ includeOffset: false })!)
  }

  if (endDate) {
    query.where('created_at', '<=', endDate.endOf('day').toSQL({ includeOffset: false })!)
  }

  const attendances = await query.orderBy('created_at', 'desc')

  const stats = {
    totalDays: attendances.length,
    totalWorkingSeconds: 0,
    attendances: attendances.map((a) => ({
      id: a.id,
      checkInTime: a.checkInTime,
      checkOutTime: a.checkOutTime,
      totalWorkingSeconds: a.totalWorkingSeconds,
      status: a.status,
    })),
  }

  attendances.forEach((attendance) => {
    stats.totalWorkingSeconds += attendance.totalWorkingSeconds
  })

  return stats
}

export const getActivityStatsByDate = async (userId: number, date: Date) => {
  const day = DateTime.fromJSDate(date)
  const startDate = day.startOf('day').toSQL({ includeOffset: false })!
  const endDate = day.endOf('day').toSQL({ includeOffset: false })!
  // A still-open session belongs to the current day, so only fold it in when the
  // requested date is today — otherwise a past-date query would wrongly surface it.
  const includeOpenSession = day.hasSame(DateTime.now(), 'day')

  return Attendance.query()
    .where('user_id', userId)
    .where((builder) => {
      builder.where((withinWindow) => {
        withinWindow.where('created_at', '>=', startDate).where('created_at', '<=', endDate)
      })
      // A session that started before the window but is still open (e.g. the user
      // checked in before midnight and has not checked out yet) is still part of
      // today's attendance — include it so its pre-midnight activities are shown.
      if (includeOpenSession) {
        builder.orWhereNull('check_out_time')
      }
    })
    .preload('timeEntries', (timeEntryQuery) => {
      timeEntryQuery.preload('project' as never).orderBy('startTime', 'asc')
    })
    .orderBy('created_at', 'desc')
}

export const autoCheckoutUsersWhoDidNotCheckOut = async () => {
  const attendances = await Attendance.query()
    .whereNotNull('check_in_time')
    .whereNull('check_out_time')
    .preload('timeEntries', (q) => q.whereNull('end_time').orderBy('id', 'desc'))

  if (attendances.length === 0) return

  for (const attendance of attendances) {
    try {
      const userLastWorkActivityTime = attendance.updatedAt

      const openEntry = attendance.timeEntries[0]
      if (openEntry) {
        openEntry.endTime = userLastWorkActivityTime
        await openEntry.save()
      }
      attendance.checkOutTime = userLastWorkActivityTime
      attendance.status = attendanceStatus.COMPLETED
      await attendance.save()
    } catch (error: any) {
      console.error(`Auto-checkout failed for attendance ${attendance.id}:`, error)
    }
  }
}

export const trackUsersWhoAreOffline = async () => {
  const offlineCutoff = DateTime.now()
    .minus({ seconds: OFFLINE_THRESHOLD_IN_SEC })
    .toSQL({ includeOffset: false })!

  const offlineAttendances = await Attendance.query()
    .where('status', attendanceStatus.ACTIVE)
    .whereNull('check_out_time')
    .where('updated_at', '<', offlineCutoff)

  for (const attendance of offlineAttendances) {
    try {
      const lastWorkActivity = await TimeEntry.query()
        .where('attendance_id', attendance.id)
        .where('type', 'work') // otherwise CRON will continue adding away entries
        .whereNull('end_time')
        .first()

      if (lastWorkActivity) {
        const lastActivityTime = attendance.updatedAt
        lastWorkActivity.endTime = lastActivityTime
        await lastWorkActivity.save()

        await TimeEntry.create({
          attendanceId: attendance.id,
          type: 'away',
          startTime: lastActivityTime,
          notes: lastWorkActivity.notes || null,
          projectId: lastWorkActivity.projectId,
        })
      }
    } catch (error: any) {
      console.error(`Offline 'away' tracking failed for attendance ${attendance.id}:`, error)
    }
  }
}

export const getAssignedProjects = async (user: User) => {
  try {
    const query = Project.query().whereHas('projectMembers', (memberQuery) => {
      memberQuery.where('user_id', user.id)
    })

    if (user.type !== UserTypeEnum.superAdmin) {
      query.select('id', 'name')
    }

    return await query
  } catch (error: any) {
    throw new Error(`Error getting assigned projects: ${error.message}`)
  }
}

export const getAllProjects = async (user: User) => {
  try {
    const query = Project.query()

    if (user.type !== UserTypeEnum.superAdmin) {
      query.select('id', 'name')
    }

    return await query
  } catch (error: any) {
    throw new Error(`Error getting all projects: ${error.message}`)
  }
}

export const getLastWorkActivity = async (userId: number) => {
  try {
    const attendance = await getLastCheckInAttendanceByUserId(userId)

    if (!attendance || !DateTime.now().hasSame(attendance.createdAt, 'day')) {
      return null
    }

    const entry = await TimeEntry.query()
      .where('attendance_id', attendance.id)
      .where('type', 'work')
      .whereNotNull('project_id')
      .orderBy('start_time', 'desc')
      .first()

    return entry
  } catch (error: any) {
    throw new Error(`Error fetching last work activity: ${error.message}`)
  }
}
