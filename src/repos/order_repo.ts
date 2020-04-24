/** Remember CRUD - create read update delete
 * Functionality to be had in the order_repo:
 *      - getAll()
 *      - getOrderByID()
 *      - addNewOrder()
 *      - addToOrder(itemID, orderID) --> 
 *          * calls getItemByID
 *          * adds item to orderContents
 *      - updateOrder()
 */
import data from '../data/order_db';
import { Order } from '../models/order';
import { CrudRepository } from './crud_repo';
import {
    ResourceNotFoundError,
    ResourcePersistenceError,
    BadRequestError,
    AuthenticationError,
    NotImplementedError
} from '../errors/errors';


class orderRepository implements CrudRepository<Order> {

    getAll(): Promise<Order[]> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                let Order: Order[] = [];

                for (let item of data) {
                    Order.push({...item});
                }

                if(Order.length === 0) {
                    reject(new ResourceNotFoundError());
                    return;
                }
                
                resolve(Order);
            }, 250);
        });
    }

    getByID(id: number): Promise<Order> {
        return new Promise<Order>((resolve, reject) => {
            reject(new NotImplementedError());
        });
    }

    save(newObj: Order): Promise<Order> {
        return new Promise<Order>((resolve, reject) => {
            reject(new NotImplementedError());
        });
    }

    update(updatedObj: Order): Promise<Boolean> {
        return new Promise<Boolean>((resolve, reject) => {
            reject(new NotImplementedError());
        });
    }

    deleteById(id: number): Promise<Boolean> {
        return new Promise<Boolean>((resolve, reject) => {
            reject(new NotImplementedError());
        });
    }

}