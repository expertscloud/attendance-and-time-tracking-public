import { sendSuccess } from '#services/custom_response_service'
import ErrorService from '#services/error_service'
import {
  createUser,
  deleteUser,
  getUserById,
  updateUserRoleBySuperAdmin,
  updateUser,
  userListing,
} from '#services/user_service'
import {
  getActivityStatsByDate,
  getAllUsersAttendances,
  getAttendanceStats,
  getUsersWithTodayAttendance,
} from '#services/attendance_service'
import { getLocationSnapshotsByDate } from '#services/location_snapshot_service'
import { paginationValidator } from '#validators/pagination_validator'
import { attendanceLocationQueryValidator } from '#validators/location_snapshot_validator'
import {
  createUserValidator,
  imageValidator,
  updateUserRoleValidator,
  updateUserValidator,
  userIdValidator,
  userStatsQueryValidator,
  userActivitiesQueryValidator,
  userAttendanceQueryValidator,
} from '#validators/user_validator'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
export default class UsersController {
  public async create(ctx: HttpContext) {
    try {
      const { image } = await imageValidator.validate({
        image: ctx.request.file('image'),
      })

      const payload = await createUserValidator.validate(ctx.request.body())
      const userResponse = await createUser(payload, image)
      return sendSuccess('User created successfully', userResponse)
    } catch (error) {
      console.log('User creating error', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  public async show(ctx: HttpContext) {
    try {
      const { userId } = await userIdValidator.validate(ctx.params)
      const userResponse = await getUserById(userId)
      return sendSuccess('User details', userResponse)
    } catch (error) {
      console.log('User getting by id error', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  public async update(ctx: HttpContext) {
    try {
      const { userId } = await userIdValidator.validate(ctx.params)

      const { image } = await imageValidator.validate({
        image: ctx.request.file('image'),
      })

      const payload = await updateUserValidator.validate(ctx.request.body(), {
        meta: { userId: ctx.request.param('userId') },
      })
      const userResponse = await updateUser(payload, userId, image)
      return sendSuccess('User updated successfully', userResponse)
    } catch (error) {
      console.error('Error while updating user:', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  public async updateRole(ctx: HttpContext) {
    try {
      const { userId } = await userIdValidator.validate(ctx.params)
      const payload = await updateUserRoleValidator.validate(ctx.request.body())

      const authUser = ctx.auth.getUserOrFail()
      const userResponse = await updateUserRoleBySuperAdmin(authUser, payload, userId)

      return sendSuccess('User role updated successfully', userResponse)
    } catch (error) {
      console.error('Error while updating user role:', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  public async delete(ctx: HttpContext) {
    try {
      const { userId } = await userIdValidator.validate(ctx.params)
      await deleteUser(userId)
      return sendSuccess('User deleted successfully')
    } catch (error) {
      console.log('User deleting error', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  public async listing(ctx: HttpContext) {
    try {
      const { page, pageSize, filters, sorts } = await paginationValidator.validate(
        ctx.request.body()
      )
      const userResponse = await userListing(page, pageSize, filters, sorts)
      return sendSuccess('Users listed successfully', userResponse)
    } catch (error) {
      console.log('User listing error', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  public async attendances(ctx: HttpContext) {
    try {
      const payload = await userAttendanceQueryValidator.validate(ctx.request.body())

      const attendances = await getAllUsersAttendances(payload)

      return sendSuccess('Attendances fetched successfully', attendances)
    } catch (error) {
      console.log('User attendances error', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  public async todayAttendance(ctx: HttpContext) {
    try {
      const users = await getUsersWithTodayAttendance()

      return sendSuccess('Users with today attendance fetched successfully', users)
    } catch (error) {
      console.log('User today attendance error', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  public async stats(ctx: HttpContext) {
    try {
      const { userId } = await userIdValidator.validate(ctx.params)
      const { startDate, endDate } = await userStatsQueryValidator.validate(ctx.request.qs())

      const start = startDate ? DateTime.fromJSDate(startDate) : DateTime.now().minus({ years: 1 })
      const end = endDate ? DateTime.fromJSDate(endDate) : DateTime.now()

      const stats = await getAttendanceStats(userId, start, end)
      return sendSuccess('User stats fetched successfully', stats)
    } catch (error) {
      console.log('User stats error', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  public async activities(ctx: HttpContext) {
    try {
      const { userId } = await userIdValidator.validate(ctx.params)
      const { date } = await userActivitiesQueryValidator.validate(ctx.request.qs())

      const stats = await getActivityStatsByDate(userId, date)
      return sendSuccess('User activities fetched successfully', stats)
    } catch (error) {
      console.log('User activities error', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  public async locations(ctx: HttpContext) {
    try {
      const { date } = await attendanceLocationQueryValidator.validate(ctx.request.qs())
      const locations = await getLocationSnapshotsByDate(DateTime.fromJSDate(date))

      return sendSuccess('User locations fetched successfully', locations)
    } catch (error) {
      console.log('User locations error', error)
      return ErrorService.handleError(ctx, error)
    }
  }
}
