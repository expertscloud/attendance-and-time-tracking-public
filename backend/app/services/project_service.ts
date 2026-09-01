import Project, { projectFilterEnum, projectSortEnum } from '#models/project'
import {
  createProjectValidatorInterface,
  updateProjectValidatorInterface,
} from '#validators/project_validator'
import { applySorting } from '#services/apply_sorting'
import { paginateQuery } from '#services/apply_pagination'
import { applyFilters } from '#services/apply_filter'
import { softDelete } from '#helpers/soft_delete_helper'
import { DateTime } from 'luxon'

export const projectListing = async (
  page?: number,
  pageSize?: number,
  filters?: Array<any>,
  sorts?: Array<any>
) => {
  try {
    let query: any
    let filterData: any
    let sortProject: any

    const projects = Project.query()
      .whereNull('deleted_at')
      .preload('client')
      .preload('teamLead')
      .preload('projectMembers', (projectMemberQuery) => {
        projectMemberQuery.preload('user')
      })

    if (filters?.length) {
      filterData = applyFilters(projects, filters, projectFilterEnum)
    }

    query = filterData?.query ?? projects

    if (sorts?.length) {
      sortProject = applySorting(query, sorts, projectSortEnum)
      query = sortProject?.query ?? query
    }

    const projectListingPaginated = await paginateQuery(query, pageSize, page)

    return {
      count: projectListingPaginated['rows'].length,
      total_count: projectListingPaginated.total,
      total_page_count: projectListingPaginated.lastPage,
      page: projectListingPaginated.currentPage,
      page_size: projectListingPaginated.perPage,
      data: projectListingPaginated['rows'].map((project: any) => ({
        ...project.serialize(),
      })),
    }
  } catch (error) {
    throw new Error(`Error retrieving projects: ${error.message}`)
  }
}

export const getProjectById = async (projectId: number) => {
  try {
    const project = await Project.query()
      .where('id', projectId)
      .preload('client')
      .preload('teamLead')
      .preload('projectMembers', (projectMemberQuery) => {
        projectMemberQuery.preload('user')
      })
      .first()

    if (!project) {
      throw new Error(`Project with ID: ${projectId} does not exist`)
    }

    return project
  } catch (error) {
    throw new Error(`Error getting project: ${error.message}`)
  }
}

const formatProjectPayload = (payload: Record<string, any>) => {
  const formattedPayload = { ...payload }

  if (formattedPayload.startDate) {
    formattedPayload.startDate = DateTime.fromJSDate(formattedPayload.startDate)
  }
  if (formattedPayload.plannedEndDate) {
    formattedPayload.plannedEndDate = DateTime.fromJSDate(formattedPayload.plannedEndDate)
  }
  if (formattedPayload.actualEndDate) {
    formattedPayload.actualEndDate = DateTime.fromJSDate(formattedPayload.actualEndDate)
  }

  return formattedPayload
}

export const createProject = async (payload: createProjectValidatorInterface) => {
  try {
    const { memberIds, ...projectPayload } = payload
    const project = await Project.create(formatProjectPayload(projectPayload))
    if (memberIds?.length) {
      await project.related('members').attach(memberIds)
    }
    return project
  } catch (error) {
    throw new Error(`Error creating project: ${error.message}`)
  }
}

export const updateProject = async (
  payload: updateProjectValidatorInterface,
  projectId: number
) => {
  try {
    const project = await getProjectById(projectId)
    const { memberIds, ...projectPayload } = payload
    await project.merge(formatProjectPayload(projectPayload)).save()
    if (memberIds?.length) {
      await project.related('members').sync(memberIds)
    }
    return project
  } catch (error) {
    throw new Error(`Error updating project: ${error.message}`)
  }
}

export const deleteProject = async (projectId: number) => {
  try {
    const project = await Project.findOrFail(projectId)
    await softDelete(project)
  } catch (error) {
    throw new Error(`Error deleting project: ${error.message}`)
  }
}
