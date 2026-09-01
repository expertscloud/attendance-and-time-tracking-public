import type { HttpContext } from '@adonisjs/core/http'
import {
  projectActionValidator,
  checkOutValidator,
  pauseTimerValidator,
  getAttendanceStatsValidator,
  activityStatsValidator,
  recentAttendanceValidator,
  syncWorkedTimeValidator,
} from '#validators/attendance_validator'
import {
  checkIn,
  checkOut,
  pauseTimer,
  resumeTimer,
  startNewTask,
  getCurrentAttendance,
  getLastWorkActivity,
  getAttendanceStats,
  getActivityStatsByDate,
  syncWorkedTime,
  getAssignedProjects as getAssignedProjectsService,
  getAllProjects as getAllProjectsService,
  getRecentAttendances,
} from '#services/attendance_service'
import { sendSuccess } from '#services/custom_response_service'
import { createLocationSnapshot } from '#services/location_snapshot_service'
import ErrorService from '#services/error_service'
import { createLocationSnapshotValidator } from '#validators/location_snapshot_validator'
import { DateTime } from 'luxon'

export default class AttendanceController {
  async checkIn(ctx: HttpContext): Promise<void> {
    try {
      const user = ctx.auth.getUserOrFail()
      const payload = await projectActionValidator.validate(ctx.request.body())
      const attendance = await checkIn(user.id, payload)

      return sendSuccess('Checked in successfully', attendance)
    } catch (error) {
      console.log('Error in checkIn controller', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  async checkOut(ctx: HttpContext): Promise<void> {
    try {
      const user = ctx.auth.getUserOrFail()
      const payload = await checkOutValidator.validate(ctx.request.body())
      const attendance = await checkOut(user.id, payload)

      return sendSuccess('Checked out successfully', attendance)
    } catch (error) {
      console.log('Error in checkOut controller', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  async pauseTimer(ctx: HttpContext): Promise<void> {
    try {
      const user = ctx.auth.getUserOrFail()
      const payload = await pauseTimerValidator.validate(ctx.request.body())

      const attendance = await pauseTimer(user.id, payload)

      return sendSuccess('Timer paused successfully', attendance)
    } catch (error) {
      console.log('Error in pauseTimer controller', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  async resumeTimer(ctx: HttpContext): Promise<void> {
    try {
      const user = ctx.auth.getUserOrFail()
      const payload = await projectActionValidator.validate(ctx.request.body())

      const attendance = await resumeTimer(user.id, payload)

      return sendSuccess('Timer resumed successfully', attendance)
    } catch (error) {
      console.log('Error in resumeTimer controller', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  async startNewTask(ctx: HttpContext): Promise<void> {
    try {
      const user = ctx.auth.getUserOrFail()
      const payload = await projectActionValidator.validate(ctx.request.body())

      const attendance = await startNewTask(user.id, payload)

      return sendSuccess('New task started successfully', attendance)
    } catch (error) {
      console.log('Error in startNewTask controller', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  async getCurrentAttendance(ctx: HttpContext): Promise<void> {
    try {
      const user = ctx.auth.getUserOrFail()

      const attendance = await getCurrentAttendance(user.id)

      return sendSuccess('Current attendance fetched successfully', attendance)
    } catch (error) {
      console.log('Error in getCurrentAttendance controller', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  async getLastWorkActivity(ctx: HttpContext): Promise<void> {
    try {
      const user = ctx.auth.getUserOrFail()
      const lastWorkSegment = await getLastWorkActivity(user.id)

      return sendSuccess('Last work activity fetched successfully', lastWorkSegment)
    } catch (error) {
      console.log('Error in getLastWorkActivity controller', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  async getActivityStatsByDate(ctx: HttpContext): Promise<void> {
    try {
      const user = ctx.auth.getUserOrFail()
      const { date } = await activityStatsValidator.validate(ctx.request.body())
      const stats = await getActivityStatsByDate(user.id, date)

      return sendSuccess('Activities stats fetched successfully', stats)
    } catch (error) {
      console.log('Error in getActivityStatsByDate controller', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  async getRecentAttendances(ctx: HttpContext): Promise<void> {
    try {
      const user = ctx.auth.getUserOrFail()
      const { limit } = await recentAttendanceValidator.validate(ctx.params)
      const attendances = await getRecentAttendances(user.id, limit)

      return sendSuccess('Recent attendances fetched successfully', attendances)
    } catch (error) {
      console.log('Error in getRecentAttendances controller', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  async getAttendanceStats(ctx: HttpContext): Promise<void> {
    try {
      const user = ctx.auth.getUserOrFail()
      const payload = await getAttendanceStatsValidator.validate(ctx.request.qs())

      const startDate = payload.startDate ? DateTime.fromJSDate(payload.startDate) : undefined
      const endDate = payload.endDate ? DateTime.fromJSDate(payload.endDate) : undefined
      const stats = await getAttendanceStats(user.id, startDate, endDate)

      return sendSuccess('Attendance stats fetched successfully', stats)
    } catch (error) {
      console.log('Error in getAttendanceStats controller', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  async syncWorkedTime(ctx: HttpContext): Promise<void> {
    try {
      const user = ctx.auth.getUserOrFail()
      const payload = await syncWorkedTimeValidator.validate(ctx.request.body())

      const attendance = await syncWorkedTime(user.id, payload)

      return sendSuccess('Attendance synced successfully', attendance)
    } catch (error) {
      console.log('Error in sync worked time controller', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  async getAssignedProjects(ctx: HttpContext): Promise<void> {
    try {
      const user = ctx.auth.getUserOrFail()
      const projects = await getAssignedProjectsService(user)

      return sendSuccess('Assigned projects fetched successfully', projects)
    } catch (error) {
      console.log('Error in getAssignedProjects controller', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  async getAllProjects(ctx: HttpContext): Promise<void> {
    try {
      const user = ctx.auth.getUserOrFail()
      const projects = await getAllProjectsService(user)

      return sendSuccess('Projects fetched successfully', projects)
    } catch (error) {
      console.log('Error in getAllProjects controller', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  async createLocationSnapshot(ctx: HttpContext): Promise<void> {
    try {
      const user = ctx.auth.getUserOrFail()
      const payload = await createLocationSnapshotValidator.validate(ctx.request.body())
      const snapshot = await createLocationSnapshot(user.id, payload)

      return sendSuccess('Location snapshot saved successfully', snapshot)
    } catch (error) {
      console.log('Error in createLocationSnapshot controller', error)
      return ErrorService.handleError(ctx, error)
    }
  }
}
