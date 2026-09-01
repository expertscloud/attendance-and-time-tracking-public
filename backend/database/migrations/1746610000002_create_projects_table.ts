import Client from '#models/client'
import Project from '#models/project'
import User from '#models/user'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = Project.table

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id')
      table.string('name')
      table.string('short_code')
      table.text('description')
      table.tinyint('status')
      table.boolean('is_billable').defaultTo(false)
      table.date('start_date')
      table.date('planned_end_date')
      table.date('actual_end_date')
      table.string('aws_account_id')
      table
        .bigInteger('client_id')
        .unsigned()
        .references('id')
        .inTable(Client.table)
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
      table
        .bigInteger('team_lead_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable(User.table)
        .onDelete('SET NULL')
        .onUpdate('CASCADE')

      table.timestamp('created_at').defaultTo(this.raw('CURRENT_TIMESTAMP'))
      table
        .timestamp('updated_at')
        .defaultTo(this.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))
      table.timestamp('deleted_at').nullable().defaultTo(null)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
