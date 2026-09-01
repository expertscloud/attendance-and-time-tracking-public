import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'attendances'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id').notNullable()
      table.bigInteger('user_id').unsigned().notNullable()
      table.timestamp('check_in_time').notNullable()
      table.timestamp('check_out_time').nullable()
      table.integer('total_working_seconds').defaultTo(0).comment('Total seconds worked')
      table.integer('total_pause_seconds').defaultTo(0).comment('Total pause time in seconds')
      table.date('work_date').notNullable()
      table.enum('status', ['active', 'paused', 'completed']).defaultTo('active')

      table.timestamp('created_at').defaultTo(this.raw('CURRENT_TIMESTAMP'))
      table
        .timestamp('updated_at')
        .defaultTo(this.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))
      table.timestamp('deleted_at').nullable().defaultTo(null)

      table
        .foreign('user_id')
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')

      table.index(['user_id', 'work_date'])
      table.index(['user_id', 'status'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
