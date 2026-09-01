import Attendance from '#models/attendance'
import LocationSnapshot from '#models/location_snapshot'
import { DateTime } from 'luxon'
import { CreateLocationSnapshotInterface } from '#validators/location_snapshot_validator'

export const createLocationSnapshot = async (
  userId: number,
  payload: CreateLocationSnapshotInterface
) => {
  try {
    const attendance = await Attendance.query()
      .where('id', payload.attendanceId)
      .where('user_id', userId)
      .whereNull('check_out_time')
      .first()

    if (!attendance) {
      throw new Error('No active attendance found for this snapshot.')
    }

    return await LocationSnapshot.create({
      userId,
      attendanceId: attendance.id,
      latitude: payload.latitude,
      longitude: payload.longitude,
    })
  } catch (error) {
    throw new Error(`Error creating location snapshot: ${error.message}`)
  }
}

export const getLocationSnapshotsByDate = async (date: DateTime) => {
  try {
    const day = date.startOf('day')
    const startDate = day.toSQL({ includeOffset: false })!
    const endDate = day.endOf('day').toSQL({ includeOffset: false })!
    const includeOpenSession = day.hasSame(DateTime.now(), 'day')

    return await LocationSnapshot.query()
      .whereHas('attendance', (attendanceQuery) => {
        attendanceQuery.where((builder) => {
          builder.where((withinWindow) => {
            withinWindow.where('created_at', '>=', startDate).where('created_at', '<=', endDate)
          })
          if (includeOpenSession) {
            builder.orWhereNull('check_out_time')
          }
        })
      })
      .preload('user')
      .orderBy('created_at', 'desc')
  } catch (error) {
    throw new Error(`Error fetching locations: ${error.message}`)
  }
}
