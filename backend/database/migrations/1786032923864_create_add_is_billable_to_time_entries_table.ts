import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'time_entries'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.boolean('is_billable').notNullable().defaultTo(false)
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('is_billable')
    })
  }
}
