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

        const serializedPoints = points.map(point => {
            return {
                ...point,
                image_url: process.env.APP_URL + `uploads/${point.image}`
            }
        })

        return response.json(serializedPoints)
    }

    async show(request: Request, response: Response) {
        const { id } = request.params;

        const point = await connection('points').select().first().where('id', id)

        if (!point) {
            return response.status(400).json('Ponto de coleta inexistente!')
        }

        const serializedPoint = {
            ...point,
            image_url: process.env.APP_URL + `uploads/${point.image}`
        }


        // listar todos os items do ponto de coleta específico
        const items = await connection('items')
            .join('point_items', 'items.id', '=', 'point_items.item_id')
            .where('point_items.point_id', id)
            .select('items.*')

        return response.json({ point: serializedPoint, items })
    }

    async create(request: Request, response: Response) {

        const {
            name,
            email,
            whatsapp,
            latitude, longitude,
            city, uf,
            items
        } = request.body

        // caso alguma query falhar ele não roda as outras
        const transaction = await connection.transaction()

        const point = {
            image: request.file.filename,
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

        const pointItems = items
            .split(',')
            .map((item: string) => Number(item.trim()))
            .map((item_id: number) => {
                return {
                    item_id,
                    point_id,
                };
            });

        await transaction('point_items').insert(pointItems)

        await transaction.commit()

        return response.json({
            id: point_id,
            ...point
        })
    }
};

export default PointsController
