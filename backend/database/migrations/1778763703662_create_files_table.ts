import User from '#models/user'
import { BaseSchema } from '@adonisjs/lucid/schema'
import File from '#models/file'
export default class extends BaseSchema {
  protected tableName = File.table

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id')
      table.string('file_name')
      table.string('file_original_name')
      table.string('file_type')
      table.string('file_ext')
      table.bigInteger('file_size')
      table.string('file_path')
      table.string('associated_table')
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

      table.timestamp('deleted_at').nullable().defaultTo(null)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
