import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'time_entries'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('duration_seconds')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('duration_seconds').nullable().comment('Duration in seconds')
    })
  }
}
