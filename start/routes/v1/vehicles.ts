const VehiclesController = () => import('#controllers/vehicles_controller')
import router from '@adonisjs/core/services/router'

export default function vehiclesRoutes() {
    router.group(() => {
        router.get('/', [VehiclesController, 'index'])
        router.post('/', [VehiclesController,'store'])
        router.delete('/:id', [VehiclesController,'destroy']) 
    }).prefix('/vehicles')
}