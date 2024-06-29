const StatusesController = () => import('#controllers/statuses_controller')
import router from '@adonisjs/core/services/router'

export default function statusesRoutes() {
    router.group(() => {
        router.get('/', [StatusesController, 'index'])
        router.patch('/', [StatusesController,'update'])
    }).prefix('/statuses')
}