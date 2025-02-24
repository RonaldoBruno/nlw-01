import { Request, Response } from 'express'
import knex from '../database/connection'

class ItemsController {
    async Index (request: Request, response:Response)  {
        const items = await knex('items').select('*');
    
        const serializedItems = items.map(item => {        
            return {
                id: item.id,
                title: item.title,
                image: item.image,
                image_url: `http://192.168.0.111:3333/uploads/${item.image}`
            };
        })
    
        return response.json(serializedItems)
    }
}

export default ItemsController