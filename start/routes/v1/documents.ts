const DocumentsController = () => import('#controllers/documents_controller')
import router from '@adonisjs/core/services/router'

export default function documentsRoutes() {
    router.group(() => {
        router.get('/', [DocumentsController, 'index'])
        router.post('/', [DocumentsController,'store'])
        router.get('/:id', [DocumentsController,'show']) 
    }).prefix('/documents')
}