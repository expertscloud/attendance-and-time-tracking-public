import User, { userFilterEnum, userSortEnum } from '#models/user'
import UserDetail from '#models/user_detail'
import {
  createUserValidatorInterface,
  updateUserRoleValidatorInterface,
  updateUserValidatorInterface,
} from '#validators/user_validator'
import { applySorting } from '#services/apply_sorting'
import { paginateQuery } from '#services/apply_pagination'
import { applyFilters } from '#services/apply_filter'
import { UserTypeEnum } from '#enums/user_type_enum'
import type { MultipartFile } from '@adonisjs/core/bodyparser'
import { DateTime } from 'luxon'
import {
  getSignedUrlByFilePath,
  uploadUserProfileAndCreateFile,
  deleteS3KeyIfExists,
} from '#services/file_service'
import { sendError, sendSuccess } from './custom_response_service.js'
import { getAllLeaveTypes } from './leave_type_service.js'

async function ensureUserDetail(user: User): Promise<UserDetail> {
  if (user?.userDetail) {
    return user.userDetail
  }

  return UserDetail.create({ userId: user.id })
}

export const userListing = async (
  page?: number,
  pageSize?: number,
  filters?: Array<any>,
  sorts?: Array<any>
) => {
  try {
    let query: any
    let filterData: any
    let sortUser: any
    let userListings = User.query()
      .whereIn('type', [UserTypeEnum.user, UserTypeEnum.admin])
      .whereNull('deletedAt')
      .preload('userDetail', (q) => q.preload('profileFile'))

    if (filters?.length) {
      filterData = applyFilters(userListings, filters, userFilterEnum)
    }
    if (filterData?.status === false) {
      return {
        status: filterData.status,
        message: filterData.message,
      }
    }
    query = filterData?.query ?? userListings
    if (sorts?.length) {
      sortUser = applySorting(query, sorts, userSortEnum)
      if (sortUser?.status) {
        return sortUser
      }
    }
    let sortQuery = sortUser?.query ?? query
    let userListingPaginated = await paginateQuery(sortQuery, pageSize, page)
    return {
      count: userListingPaginated['rows'].length,
      total_count: userListingPaginated.total,
      total_page_count: userListingPaginated.lastPage,
      page: userListingPaginated.currentPage,
      page_size: userListingPaginated.perPage,
      data: await Promise.all(
        userListingPaginated['rows'].map(async (user: any) => {
          const profileSignedUrl = await getSignedUrlByFilePath(
            user.userDetail?.profileFile?.filePath ?? null
          )
          return {
            ...user.serialize(),
            profileSignedUrl,
          }
        })
      ),
    }
  } catch (error: any) {
    throw new Error(`Error retrieving users: ${error.message}`)
  }
}

export const getUserById = async (userId: number) => {
  try {
    const user = await User.query()
      .where('id', userId)
      .preload('userDetail', (q) => q.preload('profileFile'))
      .first()

    if (!user) {
      throw new Error(`User with ID: ${userId} does not exist`)
    }

    const profileSignedUrl = await getSignedUrlByFilePath(
      user.userDetail?.profileFile?.filePath ?? null
    )
    const leaveTypes = await getAllLeaveTypes()

    return {
      ...user.serialize(),
      profileSignedUrl,
      leaveTypes,
    }
  } catch (error: any) {
    throw new Error(`Error getting user: ${error.message}`)
  }
}

export const deleteUser = async (user_id: number) => {
  try {
    const user = await User.query().where('id', user_id).preload('userDetail').first()
    if (!user) {
      throw new Error(`User with ID: ${user_id} does not exist`)
    }

    return await user.softDelete()
  } catch (error: any) {
    throw new Error(`Error deleting user: ${error.message}`)
  }
}

export const updateUser = async (
  payload: updateUserValidatorInterface,
  userId: number,
  file?: MultipartFile | null
) => {
  try {
    const user = await User.query()
      .where('id', userId)
      .preload('userDetail', (q) => q.preload('profileFile'))
      .first()

    if (!user) {
      throw new Error(`User with ID: ${userId} does not exist`)
    }

    const userDetail = await ensureUserDetail(user)

    const userData = {
      ...('email' in payload && { email: payload.email }),
      ...('fullName' in payload && { fullName: payload.fullName }),
      ...('isActive' in payload && { isActive: payload.isActive }),
      ...('employmentType' in payload && { employmentType: payload.employmentType }),
      ...('designation' in payload && { designation: payload.designation }),
      ...('workMode' in payload && { workMode: payload.workMode }),
    }

    const userDetailData = {
      ...('employeeId' in payload && { employeeId: payload.employeeId ?? null }),
      ...('phoneNumber' in payload && { phoneNumber: payload.phoneNumber ?? null }),
      ...('emergencyContactNumber' in payload && {
        emergencyContactNumber: payload.emergencyContactNumber ?? null,
      }),
      ...('gender' in payload && { gender: payload.gender ?? null }),
      ...('address' in payload && { address: payload.address ?? null }),
      ...('dob' in payload && {
        dob: payload.dob ? DateTime.fromJSDate(payload.dob) : null,
      }),
      ...('joiningDate' in payload && {
        joiningDate: payload.joiningDate ? DateTime.fromJSDate(payload.joiningDate) : null,
      }),
    }

    if (Object.keys(userData).length) {
      user.merge(userData)
    }

    if (Object.keys(userDetailData).length) {
      userDetail.merge(userDetailData)
      await userDetail.save()
    }

    await user.save()

    if (file) {
      const previousProfileFile = userDetail.profileFile

      const newFileRecord = await uploadUserProfileAndCreateFile(file, user.id)
      userDetail.profileFileId = newFileRecord.id
      await userDetail.save()

      if (previousProfileFile) {
        await deleteS3KeyIfExists(previousProfileFile.filePath)
        previousProfileFile.deletedAt = DateTime.now()
        await previousProfileFile.save()
      }
    }

    await user.refresh()
    await user.load('userDetail', (q) => q.preload('profileFile'))

    const profileSignedUrl = await getSignedUrlByFilePath(
      user.userDetail?.profileFile?.filePath ?? null
    )

    return {
      ...user.serialize(),
      profileSignedUrl,
    }
  } catch (error: any) {
    throw new Error(`Error updating user: ${error.message}`)
  }
}

export const updateUserRoleBySuperAdmin = async (
  authUser: User,
  payload: updateUserRoleValidatorInterface,
  userId: number
) => {
  try {
    if (authUser.type !== UserTypeEnum.superAdmin) {
      throw new Error('Only super admin can update user role')
    }

    const user = await User.query().where('id', userId).first()

    if (!user) {
      throw new Error(`User with ID: ${userId} does not exist`)
    }

    user.type = payload.type
    await user.save()

    return user
  } catch (error: any) {
    throw new Error(`Error updating user role: ${error.message}`)
  }
}

export const createUser = async (
  payload: createUserValidatorInterface,
  file?: MultipartFile | null
) => {
  try {
    const {
      employeeId,
      phoneNumber,
      emergencyContactNumber,
      dob,
      joiningDate,
      gender,
      address,
      ...userFields
    } = payload

    const user = await User.create({
      ...userFields,
      type: UserTypeEnum.user,
    })

    const userDetail = await UserDetail.create({
      userId: user.id,
      employeeId: employeeId ?? null,
      phoneNumber: phoneNumber ?? null,
      emergencyContactNumber: emergencyContactNumber ?? null,
      dob: dob ? DateTime.fromJSDate(dob) : null,
      joiningDate: joiningDate ? DateTime.fromJSDate(joiningDate) : null,
      gender: gender ?? null,
      address: address ?? null,
    })

    if (file) {
      const fileRecord = await uploadUserProfileAndCreateFile(file, user.id)
      userDetail.profileFileId = fileRecord.id
      await userDetail.save()
    }

    await user.load('userDetail', (q) => q.preload('profileFile'))

    const profileSignedUrl = await getSignedUrlByFilePath(
      user.userDetail?.profileFile?.filePath ?? null
    )

    return {
      ...user.serialize(),
      profileSignedUrl,
    }
  } catch (error: any) {
    throw new Error(`Error creating user: ${error.message}`)
  }
}

export const getUserByEmail = async (email: string) => {
  try {
    const user = await User.query().where('email', email).first()

    if (!user) {
      return sendError(`User with email: ${email} does not exist`)
    }

    return sendSuccess('User found', user)
  } catch (error) {
    throw new Error(`Error getting user`)
  }
}
