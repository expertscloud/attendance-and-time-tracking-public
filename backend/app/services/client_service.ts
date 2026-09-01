import Client, { clientFilterEnum, clientSortEnum } from '#models/client'
import {
  createClientValidatorInterface,
  updateClientValidatorInterface,
} from '#validators/client_validator'
import { applySorting } from '#services/apply_sorting'
import { paginateQuery } from '#services/apply_pagination'
import { applyFilters } from '#services/apply_filter'

export const clientListing = async (
  page?: number,
  pageSize?: number,
  filters?: Array<any>,
  sorts?: Array<any>
) => {
  try {
    let query: any
    let filterData: any
    let sortClient: any

    const clients = Client.query().preload('projects')

    if (filters?.length) {
      filterData = applyFilters(clients, filters, clientFilterEnum)
    }

    query = filterData?.query ?? clients

    if (sorts?.length) {
      sortClient = applySorting(query, sorts, clientSortEnum)
      query = sortClient?.query ?? query
    }

    const clientListingPaginated = await paginateQuery(query, pageSize, page)

    return {
      count: clientListingPaginated['rows'].length,
      total_count: clientListingPaginated.total,
      total_page_count: clientListingPaginated.lastPage,
      page: clientListingPaginated.currentPage,
      page_size: clientListingPaginated.perPage,
      data: clientListingPaginated['rows'].map((client: any) => ({
        ...client.serialize(),
      })),
    }
  } catch (error) {
    throw new Error(`Error retrieving clients: ${error.message}`)
  }
}

export const getClientById = async (clientId: number) => {
  try {
    const client = await Client.query().where('id', clientId).preload('projects').first()

    if (!client) {
      throw new Error(`Client with ID: ${clientId} does not exist`)
    }

    return client
  } catch (error) {
    throw new Error(`Error getting client: ${error.message}`)
  }
}

export const createClient = async (payload: createClientValidatorInterface) => {
  try {
    return await Client.create(payload)
  } catch (error) {
    throw new Error(`Error creating client: ${error.message}`)
  }
}

export const updateClient = async (payload: updateClientValidatorInterface, clientId: number) => {
  try {
    const client = await Client.findOrFail(clientId)
    await client.merge(payload).save()
    return await client
  } catch (error) {
    throw new Error(`Error updating client: ${error.message}`)
  }
}

export const deleteClient = async (clientId: number) => {
  try {
    const client = await Client.findOrFail(clientId)
    await client.delete()
  } catch (error) {
    throw new Error(`Error deleting client: ${error.message}`)
  }
}
