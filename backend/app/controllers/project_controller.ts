import type { HttpContext } from '@adonisjs/core/http'
import { sendSuccess } from '#services/custom_response_service'
import ErrorService from '#services/error_service'
import { paginationValidator } from '#validators/pagination_validator'
import {
  createProjectValidator,
  projectIdValidator,
  updateProjectValidator,
} from '#validators/project_validator'
import {
  createProject,
  deleteProject,
  getProjectById,
  projectListing,
  updateProject,
} from '#services/project_service'

export default class ProjectsController {
  public async create(ctx: HttpContext) {
    try {
      const payload = await createProjectValidator.validate(ctx.request.body())
      const projectResponse = await createProject(payload)
      return sendSuccess('Project created successfully', projectResponse)
    } catch (error) {
      console.log('Project creating error', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  public async show(ctx: HttpContext) {
    try {
      const { projectId } = await projectIdValidator.validate(ctx.params)
      const projectResponse = await getProjectById(projectId)
      return sendSuccess('Project details', projectResponse)
    } catch (error) {
      console.log('Project getting by id error', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  public async update(ctx: HttpContext) {
    try {
      const { projectId } = await projectIdValidator.validate(ctx.params)
      const payload = await updateProjectValidator.validate(ctx.request.body())
      const projectResponse = await updateProject(payload, projectId)
      return sendSuccess('Project updated successfully', projectResponse)
    } catch (error) {
      console.log('Project updating error', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  public async delete(ctx: HttpContext) {
    try {
      const { projectId } = await projectIdValidator.validate(ctx.params)
      await deleteProject(projectId)
      return sendSuccess('Project deleted successfully')
    } catch (error) {
      console.log('Project deleting error', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  public async listing(ctx: HttpContext) {
    try {
      const { page, pageSize, filters, sorts } = await paginationValidator.validate(
        ctx.request.body()
      )
      const projectResponse = await projectListing(page, pageSize, filters, sorts)
      return sendSuccess('Projects listed successfully', projectResponse)
    } catch (error) {
      console.log('Project listing error', error)
      return ErrorService.handleError(ctx, error)
    }
  }
}
