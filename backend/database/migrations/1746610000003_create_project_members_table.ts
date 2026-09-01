import Project from '#models/project'
import ProjectMember from '#models/project_member'
import User from '#models/user'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = ProjectMember.table
  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id')
      table
        .bigInteger('project_id')
        .unsigned()
        .references('id')
        .inTable(Project.table)
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
      table
        .bigInteger('user_id')
        .unsigned()
        .references('id')
        .inTable(User.table)
        .onDelete('CASCADE')
        .onUpdate('CASCADE')

      table.timestamp('created_at').defaultTo(this.raw('CURRENT_TIMESTAMP'))
      table
        .timestamp('updated_at')
        .defaultTo(this.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
