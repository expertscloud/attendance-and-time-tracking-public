import LeaveType from '#models/leave_type'
import { leaveTypeEnums } from '#enums/leave_enum'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class LeaveTypeSeeder extends BaseSeeder {
  public async run() {
    for (const item of Object.values(leaveTypeEnums)) {
      await LeaveType.updateOrCreate(
        { id: item.id },
        {
          id: item.id,
          label: item.label,
          allowance: item.allowance,
          color: item.color,
          isDefault: true,
        }
      )
    }
  }
}
