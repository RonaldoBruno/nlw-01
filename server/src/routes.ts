import express from 'express'
import multer from 'multer'
import multerConfig from './config/multer'
import { celebrate, Joi} from 'celebrate'

import PointsController from './controllers/PointsController'
import ItemsController from './controllers/ItemsController'

const routes = express.Router();
const upload = multer(multerConfig);

const pointsController = new PointsController();
const itemsController = new ItemsController();

//LISTAGEM DE ITENS
routes.get('/items',itemsController.Index)

routes.get('/points',pointsController.index)
routes.get('/points/:id',pointsController.show)

routes.post(
    '/points',
    upload.single('image'), 
    celebrate({
        body: Joi.object().keys({
            name: Joi.string().required(),
            email: Joi.string().required().email(),
            whatsapp: Joi.number().required(),
            latitude: Joi.number().required(),
            longitude: Joi.number().required(),
            city: Joi.number().required(),
            uf: Joi.number().required().max(2),
            items: Joi.string().required()
        })
    }, {abortEarly: false}),
    pointsController.create
);

export default routes;