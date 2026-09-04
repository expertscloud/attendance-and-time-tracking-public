import Client from '#models/client'
import Project from '#models/project'
import ProjectMember from '#models/project_member'
import { projectStatusEnums } from '#enums/master_enum'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { DateTime } from 'luxon'

export default class ProjectSeeder extends BaseSeeder {
  public async run() {
    const client = await Client.updateOrCreate(
      { id: 1 },
      {
        id: 1,
        name: 'Demo Client',
        email: 'client@example.com',
      }
    )

    const project = await Project.updateOrCreate(
      { id: 1 },
      {
        id: 1,
        name: 'Demo Project',
        shortCode: 'DEMO',
        description: 'Sample project for local Docker development.',
        clientId: client.id,
        status: projectStatusEnums.inProgress.id,
        isBillable: true,
        startDate: DateTime.now().minus({ weeks: 2 }),
        teamLeadId: 2,
      }
    )

    await ProjectMember.updateOrCreate(
      { projectId: project.id, userId: 2 },
      {
        projectId: project.id,
        userId: 2,
      }
    )
  }
}
