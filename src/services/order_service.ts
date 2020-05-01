import { Order } from "../models/order";
import { OrderRepository } from "../repos/order_repo";
import { isValidId, isValidStrings, isValidObject, isPropertyOf, isEmptyObject } from "../util/validator";
import { BadRequestError, 
    ResourceNotFoundError, 
    NotImplementedError, 
    ResourcePersistenceError, 
    AuthenticationError 
} from "../errors/errors";
import { query } from "express";

export class OrderService {

    constructor(private orderRepo: OrderRepository) {
        this.orderRepo = orderRepo;
    }

    async getAllOrders(): Promise<Order[]> {



        let orders = await this.orderRepo.getAll();

        if (orders.length == 0) {
            throw new ResourceNotFoundError();
        }

        return orders;

    }

    async getOrderById(id: number): Promise<Order> {

        if (!isValidId(id)) {
            throw new BadRequestError();
        }

        let order = await this.orderRepo.getByID(id);

        if (isEmptyObject(order)) {
            throw new ResourceNotFoundError();
        }

        return order;

    }


    //Maybe add equivalent methods for :
    // getUserByCredentials(un: string, pw: string): Promise<User> {}
    // authenticateUser(un: string, pw: string): Promise<User> {}


    async addNewOrder(newOrder: Order): Promise<Order> {
        
        if (!isValidObject(newOrder, 'id')) {
            throw new BadRequestError('Invalid property values found in provided user.');
        }

        const persistedOrder = await this.orderRepo.save(newOrder);

        return persistedOrder;

    }

    async updateOrder(updatedOrder: Order): Promise<boolean> {
        
        if (!isValidObject(updatedOrder)) {
            throw new BadRequestError('Invalid user provided (invalid values found).');
        }

        // let repo handle some of the other checking since we are still mocking db
        return await this.orderRepo.update(updatedOrder);

    }

    deleteById(id: number): Promise<boolean> {
        
        throw new NotImplementedError();

    }


}