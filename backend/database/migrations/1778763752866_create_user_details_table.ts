import User from '#models/user'
import File from '#models/file'
import UserDetail from '#models/user_detail'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = UserDetail.table
  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id')
      table
        .bigInteger('user_id')
        .unsigned()
        .references('id')
        .inTable(User.table)
        .onDelete('CASCADE')
        .onUpdate('CASCADE')

      table.integer('employee_id')
      table.string('phone_number')
      table.string('emergency_contact_number')
      table.date('dob')
      table.date('joining_date')
      table.integer('gender')
      table.text('address')
      table
        .bigInteger('profile_file_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable(File.table)
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
