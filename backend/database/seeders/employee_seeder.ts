import { UserTypeEnum } from '#enums/user_type_enum'
import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class EmployeeSeeder extends BaseSeeder {
  public async run() {
    await User.updateOrCreate(
      { id: 2 },
      {
        id: 2,
        email: 'employee@example.com',
        password: 'Employee@1234',
        fullName: 'Demo Employee',
        type: UserTypeEnum.user,
        isActive: true,
      }
    )
  }
}
