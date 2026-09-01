/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import '#start/routes/user_routes'
import '#start/routes/auth_routes'
import '#start/routes/email_routes'
import '#start/routes/attendance_routes'
import '#start/routes/project_routes'
import '#start/routes/client_routes'
import '#start/routes/general_routes'
import '#start/routes/leave_routes'
import '#start/routes/leave_type_routes'

import { sendSuccess } from '#services/custom_response_service'

router.get('/', async () => {
  return sendSuccess('Server is running')
})
