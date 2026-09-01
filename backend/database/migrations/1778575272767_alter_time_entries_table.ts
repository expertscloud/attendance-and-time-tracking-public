import Project from '#models/project'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'time_entries'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .bigInteger('project_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable(Project.table)
        .onDelete('SET NULL')
        .onUpdate('CASCADE')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign(['project_id'])
      table.dropColumn('project_id')
    })
  }
}
