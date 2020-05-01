import url from 'url';
import express from 'express';
import { User } from '../models/user';
import {UserServiceInstance} from '../config/app';
import { ParsedUrlQuery } from 'querystring';
import { isEmptyObject } from '../util/validator';

export const UserRouter = express.Router();

const userInstance = new UserServiceInstance;
const userService = userInstance.getInstance();

UserRouter.get('', async (req, resp) => {
    try {

        let reqURL = url.parse(req.url, true);

        if(!isEmptyObject<ParsedUrlQuery>(reqURL.query)) {
            let payload = await userService.getUserByUniqueKey({...reqURL.query});
            resp.status(200).json(payload);
        } else {
            let payload = await userService.getAllUsers();
            resp.status(200).json(payload);
        }

    } catch (e) {
        resp.status(e.statusCode).json(e);
    }
});

UserRouter.get('/:id', async (req, resp) => {
    const id = +req.params.id;
    try {
        let payload = await userService.getUserById(id);
        return resp.status(200).json(payload);
    } catch (e) {
        return resp.status(e.statusCode).json(e).send();
    }
});


UserRouter.post('', async (req, resp) => {

    console.log('USER POST REQUEST RECEIVED AT /users');
    console.log(req.body);
    try {
        let newUser = await userService.addNewUser(req.body);
        return resp.status(201).json(newUser).send();
    } catch (e) {
        return resp.status(e.statusCode).json(e).send();
    }
});
