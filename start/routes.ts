import router from '@adonisjs/core/services/router'
import { HttpContext } from '@adonisjs/core/http'

import { middleware } from './kernel.js'
import authRoutes from './routes/v1/auth.js'
import vehiclesRoutes from './routes/v1/vehicles.js'


router.get('/', async ({ response }: HttpContext) => {
  response.status(200).json({
    status: 200,
    message: 'Welcome to Document Track Be',
  })
})
  
router.group(() => {
  authRoutes()
  vehiclesRoutes()

  router.group(() => {
    router.group(() => {
    }).middleware(middleware.verifiedEmail())
  }).middleware(middleware.auth({ guards: ['api'] }))

}).prefix('/api/v1')