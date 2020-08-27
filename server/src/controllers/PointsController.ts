import connection from '../database/connection';
import { Request, Response } from 'express';

class PointsController {

    async index(request: Request, response: Response) {

        // BUSCANDO PONTOS DE COLETA ESPECÍFICOS
        const { city, uf, items } = request.query;

        const parsedItems = String(items)
            .split(',')
            .map(item => Number(item.trim()))

        const points = await connection('points')
            .join('point_items', 'points.id', '=', 'point_items.point_id')
            .whereIn('point_items.item_id', parsedItems)
            .where('city', String(city))
            .where('uf', String(uf))
            .distinct()
            .select('points.*')

        return response.json(points)
    }

    async show(request: Request, response: Response) {
        const { id } = request.params;

        const point = await connection('points').select().first().where('id', id)

        if (!point) {
            return response.status(400).json('Ponto de coleta inexistente!')
        }
        // listar todos os items do ponto de coleta específico
        const items = await connection('items')
            .join('point_items', 'items.id', '=', 'point_items.item_id')
            .where('point_items.point_id', id)
            .select('items.*')

        return response.json({ point, items })
    }

    async create(request: Request, response: Response) {

        const {
            id, image, name,
            email, whatsapp, latitude,
            longitude, city, uf,
            items
        } = request.body

        // caso alguma query falhar ele não roda as outras
        const transaction = await connection.transaction()

        const point = {
            image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60',
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf
        }

        const insertedIds = await transaction('points').insert(point)

        // relacionamento
        const point_id = insertedIds[0]

        const pointItems = items.map((item_id: number) => {
            return {
                item_id,
                point_id
            }
        })

        await transaction('point_items').insert(pointItems)

        transaction.commit()

        return response.json({
            id: point_id,
            ...point
        })
    }
};

export default PointsController
