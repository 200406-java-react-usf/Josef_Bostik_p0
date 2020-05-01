import url from 'url';
import express from 'express';
import { Item } from '../models/item';
import { ItemServiceInstance } from '../config/app';

export const ItemRouter = express.Router();

const itemInstance = new ItemServiceInstance;
const itemService = itemInstance.getInstance();

ItemRouter.get('', async (req, resp) => {
    try {
        
        let payload = await itemService.getAllItems();
        return resp.status(200).json(payload);

    } catch (e) {
        return resp.status(e.statusCode).json(e).send();
    }
});

ItemRouter.get('/:id', async (req, resp) => {
    const id = +req.params.id;
    try {
        let payload = await itemService.getItemById(id);
        return resp.status(200).json(payload);
    } catch (e) {
        return resp.status(e.statusCode).json(e).send();
    }
});

/**
 * Implement add item 
 */
// UserRouter.post('', async (req, resp) => {

//     console.log('ORDER REQUEST RECEIVED AT /users');
//     console.log(req.body);
//     try {
//         let newUser = await userService.addNewUser(req.body);
//         return resp.status(201).json(newUser).send();
//     } catch (e) {
//         return resp.status(e.statusCode).json(e).send();
//     }
// });
