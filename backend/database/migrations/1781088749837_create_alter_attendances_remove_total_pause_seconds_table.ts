import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'attendances'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('total_pause_seconds')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('total_pause_seconds').defaultTo(0).comment('Total pause time in seconds')
    })
  }
}