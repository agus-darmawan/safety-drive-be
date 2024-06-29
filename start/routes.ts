import router from '@adonisjs/core/services/router'
import { HttpContext } from '@adonisjs/core/http'

import authRoutes from './routes/v1/auth.js'
import vehiclesRoutes from './routes/v1/vehicles.js'
import statusesRoutes from './routes/v1/statuses.js'


router.get('/', async ({ response }: HttpContext) => {
  response.status(200).json({
    status: 200,
    message: 'Welcome to Document Track Be',
  })
})
  
router.group(() => {
  authRoutes()
  vehiclesRoutes()
  statusesRoutes()
}).prefix('/api/v1')