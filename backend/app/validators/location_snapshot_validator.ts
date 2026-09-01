import vine from '@vinejs/vine'
import { Infer } from '@vinejs/vine/types'
import Attendance from '#models/attendance'

export const createLocationSnapshotValidator = vine.compile(
  vine.object({
    attendanceId: vine
      .number()
      .positive()
      .exists(async (db, value) => {
        return await db.from(Attendance.table).where('id', value).first()
      }),
    latitude: vine.number().min(-90).max(90),
    longitude: vine.number().min(-180).max(180),
  })
)
export type CreateLocationSnapshotInterface = Infer<typeof createLocationSnapshotValidator>

export const attendanceLocationQueryValidator = vine.compile(
  vine.object({
    date: vine.date(),
  })
)

export type AttendanceLocationQueryInterface = Infer<typeof attendanceLocationQueryValidator>
