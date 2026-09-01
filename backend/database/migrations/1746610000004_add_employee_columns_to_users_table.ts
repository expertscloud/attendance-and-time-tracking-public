import User from '#models/user'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = User.table

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.tinyint('employment_type')
      table.tinyint('designation')
      table.tinyint('work_mode')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('employment_type')
      table.dropColumn('designation')
      table.dropColumn('work_mode')
    })
  }
}
