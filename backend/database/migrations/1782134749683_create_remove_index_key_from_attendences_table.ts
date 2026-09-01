import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'attendances'
  private indexName = 'attendances_user_id_work_date_index'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropIndex(['user_id', 'work_date'], this.indexName)
    })
  }

  async down() {}
}
