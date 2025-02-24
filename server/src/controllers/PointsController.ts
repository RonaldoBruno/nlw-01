import { Request, Response } from 'express'
import knex from '../database/connection'

class PointsController {
    async index(request: Request, response: Response){
        //cidade, uf, items
        const {city, uf, items} =  request.query;

        const parsedItems = String(items)
        .split(',')
        .map(item => Number(item.trim()));

        const points = await knex('points')
        .join('point_item', 'point_id', '=', 'point_item.point_id')
        .whereIn('point_item.item_id',parsedItems)
        .where('city', String(city))
        .where('uf', String(uf))
        .distinct()
        .select('points.*')

        const serializedPoints = points.map(point => {        
            return {
              ...point,
              image_url: `http://192.168.0.111:3333/uploads/${point.image}`
            };
        })


        return response.json(serializedPoints);
    }

    async show (request:Request, response: Response){
        const { id } = request.params;

        const point = await knex('points').where('id', id).first();
        
        if(!point){
            return response.status(400).json({ message: 'Point not found.'})
        }

        const serializedPoint = {        
              ...point,
              image_url: `http://192.168.0.111:3333/uploads/${point.image}`
        }

        const items = await knex('items')
        .join('point_item', 'items.id' ,'=' , 'point_item.item_id')
        .where('point_item.point_id', id);

        return response.json({point: serializedPoint, items})
    }

    async create (request: Request, response: Response) {

        const { name, email, whatsapp, latitude, longitude, city, uf, items } = request.body;
        
        const trx = await knex.transaction()
        
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

        const insertedIds = await trx('points').insert(point);
        
        const point_id = insertedIds[0]
        
        const points_items = items
        .split(',')
        .map((item: String) => Number(item.trim()))
        .map((item_id: number) => {
            return { 
                item_id,
                point_id}
        })
        
        await trx('point_item').insert(points_items);

        await trx.commit();
        
        return response.json({ id: point_id, ...point,})
    }
}

export default PointsController