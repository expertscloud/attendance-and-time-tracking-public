import type { HttpContext } from '@adonisjs/core/http'
import { sendSuccess } from '#services/custom_response_service'
import ErrorService from '#services/error_service'
import { paginationValidator } from '#validators/pagination_validator'
import {
  clientIdValidator,
  createClientValidator,
  updateClientValidator,
} from '#validators/client_validator'
import {
  clientListing,
  createClient,
  deleteClient,
  getClientById,
  updateClient,
} from '#services/client_service'

export default class ClientsController {
  public async create(ctx: HttpContext) {
    try {
      const payload = await createClientValidator.validate(ctx.request.body())
      const clientResponse = await createClient(payload)
      return sendSuccess('Client created successfully', clientResponse)
    } catch (error) {
      console.log('Client creating error', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  public async show(ctx: HttpContext) {
    try {
      const { clientId } = await clientIdValidator.validate(ctx.params)
      const clientResponse = await getClientById(clientId)
      return sendSuccess('Client details', clientResponse)
    } catch (error) {
      console.log('Client getting by id error', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  public async update(ctx: HttpContext) {
    try {
      const { clientId } = await clientIdValidator.validate(ctx.params)
      const payload = await updateClientValidator.validate(ctx.request.body())
      const clientResponse = await updateClient(payload, clientId)
      return sendSuccess('Client updated successfully', clientResponse)
    } catch (error) {
      console.log('Client updating error', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  public async delete(ctx: HttpContext) {
    try {
      const { clientId } = await clientIdValidator.validate(ctx.params)
      await deleteClient(clientId)
      return sendSuccess('Client deleted successfully')
    } catch (error) {
      console.log('Client deleting error', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  public async listing(ctx: HttpContext) {
    try {
      const { page, pageSize, filters, sorts } = await paginationValidator.validate(
        ctx.request.body()
      )
      const clientResponse = await clientListing(page, pageSize, filters, sorts)
      return sendSuccess('Clients listed successfully', clientResponse)
    } catch (error) {
      console.log('Client listing error', error)
      return ErrorService.handleError(ctx, error)
    }
  }
}
