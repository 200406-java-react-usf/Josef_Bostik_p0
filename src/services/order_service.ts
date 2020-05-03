/**
 * The purpose of order_service ensures that all properties passed to order_repo are valid.
 */

import { Order } from '../models/order';
import { OrderRepository } from '../repos/order_repo';
import { isValidId, 
    isValidObject, 
    isEmptyObject 
} from '../util/validator';
import { BadRequestError, 
    ResourceNotFoundError
} from '../errors/errors';

export class OrderService {

    constructor(private orderRepo: OrderRepository) {
        this.orderRepo = orderRepo;
    }

    /**
     * Retrieves all orders from the orderRepo and returns them
     * if they exist.
     */
    async getAllOrders(): Promise<Order[]> {



        let orders = await this.orderRepo.getAll();

        if (orders.length == 0) {
            throw new ResourceNotFoundError();
        }

        return orders;

    }

    /**
     * Gets an order by its serial ID value
     */
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


    /**
     * Adds a new order to the database
     */
    async addNewOrder(newOrder: Order): Promise<Order> {
        
        if (!isValidObject(newOrder, 'id')) {
            throw new BadRequestError('Invalid property values found in provided user.');
        }

        const persistedOrder = await this.orderRepo.save(newOrder);

        return persistedOrder;

    }

    /**
     * Updates an order at the specified index given a new order object and a
     * specified index.
     */
    async updateOrder(id: number, updatedOrder: Order): Promise<boolean> {
        


        if (!isValidObject(updatedOrder)) {
            throw new BadRequestError('Invalid order provided (invalid values found).');
        }

        // let repo handle some of the other checking since we are still mocking db
        updatedOrder.id = id;

        return await this.orderRepo.update(updatedOrder);

    }

    /**
     * Deletes an item given its serial ID
     */
    async deleteById(id: number): Promise<boolean> {
        
        if(!isValidId(id)) {
            throw new BadRequestError();
        }

        return await this.orderRepo.deleteById(id);

    }


}