import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'time_entries'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id').notNullable()
      table.bigInteger('attendance_id').unsigned().notNullable()
      table.enum('type', ['work', 'pause']).notNullable()
      table.timestamp('start_time').notNullable()
      table.timestamp('end_time').nullable()
      table.integer('duration_seconds').nullable().comment('Duration in seconds')
      table.text('notes').nullable()

      table.timestamp('created_at').defaultTo(this.raw('CURRENT_TIMESTAMP'))
      table
        .timestamp('updated_at')
        .defaultTo(this.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))
      table.timestamp('deleted_at').nullable().defaultTo(null)

      table
        .foreign('attendance_id')
        .references('id')
        .inTable('attendances')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')

      table.index(['attendance_id', 'type'])
      table.index(['attendance_id', 'start_time'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
