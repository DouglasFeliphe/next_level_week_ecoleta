import connection from '../database/connection'
import { Request, Response } from 'express';

class ItemsController {

    async index(request: Request, response: Response) {
        const items = await connection('items').select('*')
        // transforma os dados para um novo formato
        const serializedItems = items.map(item => {
            return {
                id: item.id,
                title: item.title,
                image_url: `http://192.168.42.52:3333/uploads/${item.image}`
            }
        })

        return response.json(serializedItems)
    }

}

export default ItemsController