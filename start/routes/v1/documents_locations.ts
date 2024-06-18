const DocumentsLocationsController = () => import('#controllers/documents_locations_controller')
import router from '@adonisjs/core/services/router'

export default function documentsLocationsRoutes() {
    router.group(() => {
        router.get('/', [DocumentsLocationsController, 'index'])
        router.post('/', [DocumentsLocationsController,'store'])
        router.get('/:id', [DocumentsLocationsController,'show']) 
    }).prefix('/documents_locations')
}