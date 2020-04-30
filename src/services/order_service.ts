import { Order } from "../models/order";
import { OrderRepository } from "../repos/order_repo";
import { isValidId, isValidStrings, isValidObject, isPropertyOf } from "../util/validator";
import { BadRequestError, ResourceNotFoundError, NotImplementedError, ResourcePersistenceError, AuthenticationError } from "../errors/errors";
import { query } from "express";

export class OrderService {

    constructor(private orderRepo: OrderRepository) {
        this.orderRepo = orderRepo;
    }

    getAllOrders(): Promise<Order[]> {

        return new Promise<Order[]>(async (resolve, reject) => {

            let orders: Order[] = [];
            let result = await this.orderRepo.getAll();

            for (let order of result) {
                orders.push({...order});
            }

            if (orders.length == 0) {
                reject(new ResourceNotFoundError());
                return;
            }

            resolve(orders);

        });

    }

    getOrderById(id: number): Promise<Order> {

        return new Promise<Order>(async (resolve, reject) => {

            if (!isValidId(id)) {
                return reject(new BadRequestError());
            }

            let order = {...await this.orderRepo.getByID(id)};

            if(Object.keys(order).length === 0) {
                reject(new ResourceNotFoundError());
                return;
            }

            resolve(order);

        });

    }

    // getUserByCredentials(un: string, pw: string): Promise<User> {
        
    //     return new Promise<User>(async (resolve, reject) => {
        
    //         try {
    //             const user = {...await this.userRepo.getUserByCredentials(un, pw)};
    //             resolve(user);  
    //         } catch (e) {
    //             reject (e);
    //         }

    //     });
    // }

    // authenticateUser(un: string, pw: string): Promise<User> {

    //     return new Promise<User>(async (resolve, reject) => {

    //         if (!isValidStrings(un, pw)) {
    //             reject(new BadRequestError());
    //             return;
    //         }

    //         let authUser: User;
    //         try {
    //             authUser = await this.userRepo.getUserByCredentials(un, pw);
    //         } catch (e) {
    //             reject(e);
    //         }

    //         if (Object.keys(authUser).length === 0) {
    //             reject(new AuthenticationError('Bad credentials provided.'));
    //             return;
    //         }

    //         resolve(this.removePassword(authUser));

    //     });

    // }

    // addNewUser(newUser: User): Promise<User> {
        
    //     return new Promise<User>(async (resolve, reject) => {

    //         if (!isValidObject(newUser, 'id')) {
    //             reject(new BadRequestError('Invalid property values found in provided user.'));
    //             return;
    //         }

    //         let conflict = this.getUserByUniqueKey({username: newUser.username});
        
    //         if (conflict) {
    //             reject(new ResourcePersistenceError('The provided username is already taken.'));
    //             return;
    //         }
        
    //         conflict = this.getUserByUniqueKey({email: newUser.email});
    
    //         if (conflict) {
    //             reject(new ResourcePersistenceError('The provided email is already taken.'));
    //             return;
    //         }

    //         try {
    //             const persistedUser = await this.userRepo.save(newUser);
    //             resolve(this.removePassword(persistedUser));
    //         } catch (e) {
    //             reject(e);
    //         }

    //     });

    // }

    // updateUser(updatedUser: User): Promise<boolean> {
        
    //     return new Promise<boolean>(async (resolve, reject) => {

    //         if (!isValidObject(updatedUser)) {
    //             reject(new BadRequestError('Invalid user provided (invalid values found).'));
    //             return;
    //         }

    //         try {
    //             // let repo handle some of the other checking since we are still mocking db
    //             resolve(await this.userRepo.update(updatedUser) as boolean);
    //         } catch (e) {
    //             reject(e);
    //         }

    //     });

    // }

    // deleteById(id: number): Promise<boolean> {
        
    //     return new Promise<boolean>(async (resolve, reject) => {
    //         reject(new NotImplementedError());
    //     });

    // }


}