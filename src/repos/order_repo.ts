/** Remember CRUD - create read update delete
 * Functionality to be had in the order_repo:
 *      - getAll()
 *      - getOrderByID()
 *      - addNewOrder()
 *      - addToOrder(itemID, orderID) --> 
 *          * calls getItemByID
 *          * adds item to orderContents
 *      - updateOrder()
 * 
 *      CREATE ORDERCOST METHOD
 */
import data from '../data/order_db';
import { Order } from '../models/order';
import { CrudRepository } from './crud_repo';
import Validator from '../util/validator';
import {
    ResourceNotFoundError,
    ResourcePersistenceError,
    BadRequestError,
    AuthenticationError,
    NotImplementedError
} from '../errors/errors';


export class OrderRepository implements CrudRepository<Order> {

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
            if (!Validator.isValidId(id)) {
                reject(new BadRequestError());
            }

            setTimeout(() => {
                
                const order = {...data.find(order=> order.id === id)};

                if(Object.keys(order).length === 0) {
                    reject(new ResourceNotFoundError());
                    return;
                }

                resolve(order);

            }, 250);
        });
    }

    save(newOrder: Order): Promise<Order> {
        return new Promise<Order>((resolve, reject) => {
            if (!Validator.isValidObject(newOrder, 'id')) {
                reject(new BadRequestError('Invalid property values found in provided order.'));
                return;
            }
        
            setTimeout(() => {
        
                newOrder.id = (data.length) + 1;
                data.push(newOrder);
        
                resolve(newOrder);
            }, 250);
        });
    }

    update(updatedOrder: Order): Promise<Boolean> {
        return new Promise<Boolean>((resolve, reject) => {
            setTimeout(() => {
        
                let persistedOrder = data.find(order => order.id === updatedOrder.id);
        
                if (!persistedOrder) {
                    reject(new ResourceNotFoundError('No order found with provided id.'));
                    return;
                }
        
    
                persistedOrder = updatedOrder;
    
                resolve(true);
        
            });
        });
    }

    //Not yet implemented
    deleteById(id: number): Promise<Boolean> {
        return new Promise<Boolean>((resolve, reject) => {
            if (!Validator.isValidId(id)) {
                reject(new BadRequestError());
            }

            reject(new NotImplementedError());
        });
    }

}