import url from 'url';
import express from 'express';
import { Order } from '../models/order';
import {OrderServiceInstance} from '../config/app';

export const OrderRouter = express.Router();

const orderInstance = new OrderServiceInstance;
const orderService = orderInstance.getInstance();

OrderRouter.get('', async (req, resp) => {
    try {

        let reqURL = url.parse(req.url, true);

        let payload = await orderService.getAllOrders();
        return resp.status(200).json(payload);

    } catch (e) {
        return resp.status(e.statusCode).json(e).send();
    }
});

OrderRouter.get('/:id', async (req, resp) => {
    const id = +req.params.id;
    try {
        let payload = await orderService.getOrderById(id);
        return resp.status(200).json(payload);
    } catch (e) {
        return resp.status(e.statusCode).json(e).send();
    }
});

/**
 * Implement add order
 */
// OrderRouter.post('', async (req, resp) => {

//     console.log('ORDER REQUEST RECEIVED AT /users');
//     console.log(req.body);
//     try {
//         let newUser = await orderService.addNewOrder(req.body);
//         return resp.status(201).json(newUser).send();
//     } catch (e) {
//         return resp.status(e.statusCode).json(e).send();
//     }
// });