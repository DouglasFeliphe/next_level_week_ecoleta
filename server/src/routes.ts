import express from 'express'
import PointsController from './controllers/PointsController'
import ItemsController from './controllers/ItemsController'

const itemsController = new ItemsController()
const pointsController = new PointsController()

const routes = express.Router()

// listar todos os itens
routes.get('/items', itemsController.index)

// listar pontos de coleta específicos
routes.get('/points', pointsController.index)

// mostrar ponto de coleta espeçífico
routes.get('/points/:id', pointsController.show)

routes.post('/point', pointsController.create)


export default routes