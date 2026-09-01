import { FiltersInterface } from '#interfaces/filters_interface'
import { BaseModel } from '@adonisjs/lucid/orm'
import { ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'
import moment from 'moment'

const validateFilters = (filters: FiltersInterface[], filterEnum?: string[]) => {
  for (const filter of filters) {
    if (!filterEnum?.includes(filter.columnName)) {
      throw new Error(`List of valid filters is [${filterEnum}]`)
    }

    if (filter.type !== 'exact' && filter.type !== 'like') {
      throw new Error(`List valid filter type is [exact, like]`)
    }

    if (filter.type === 'exact' && filter.columnName === 'created_at') {
      if (!filter.startDate || !filter.endDate) {
        throw new Error(`List of valid filters is [${filterEnum}]`)
      }
    }
  }
}

const groupLikeFiltersByValue = (likeFilters: FiltersInterface[]) => {
  const groups = new Map<string, FiltersInterface[]>()

  for (const filter of likeFilters) {
    const key = String(filter.value)
    const group = groups.get(key) ?? []
    group.push(filter)
    groups.set(key, group)
  }

  return groups
}

export const applyFilters = (
  query: ModelQueryBuilderContract<typeof BaseModel>,
  filters: Array<FiltersInterface>,
  filterEnum?: Array<string>
) => {
  validateFilters(filters, filterEnum)

  let appendQuery = query
  const likeFilters: FiltersInterface[] = []

  for (const filter of filters) {
    const column = `${query.model.table}.${filter.columnName}`

    if (filter.type === 'exact') {
      if (filter.columnName === 'created_at') {
        const startDate = moment(filter.startDate).startOf('day').format('YYYY-MM-DD HH:mm:ss')
        const endDate = moment(filter.endDate).endOf('day').format('YYYY-MM-DD HH:mm:ss')

        appendQuery = appendQuery.andWhereBetween(column, [startDate, endDate])
      } else {
        appendQuery = appendQuery.andWhere(column, `${filter.value}`)
      }
      continue
    }

    likeFilters.push(filter)
  }

  for (const group of groupLikeFiltersByValue(likeFilters).values()) {
    if (group.length === 1) {
      const filter = group[0]
      appendQuery = appendQuery.andWhereILike(
        `${query.model.table}.${filter.columnName}`,
        `%${filter.value}%`
      )
      continue
    }

    appendQuery = appendQuery.andWhere((subQuery) => {
      group.forEach((filter, index) => {
        const column = `${query.model.table}.${filter.columnName}`
        const pattern = `%${filter.value}%`

        if (index === 0) {
          subQuery.whereILike(column, pattern)
        } else {
          subQuery.orWhereILike(column, pattern)
        }
      })
    })
  }

  return {
    status: true,
    message: 'Filtered query',
    query: appendQuery,
  }
}
