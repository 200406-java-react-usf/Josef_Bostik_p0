/**
 * Information to be stored in user object:
 *      - userID
 *      - username
 *      - password
 *      - firstname
 *      - lastname
 *      - cart
 *      - openOrders
 *      - closedOrders
 */

import { Order } from "./order";

export class User {

    id: number;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    email: string;
    dob: Date;
    activeOrders: Order[];
    closedOrders: Order[];
    

    constructor(id: number, un: string, pw: string, fn: string, ln: string, email: string, dob: Date, ao: Order[], co: Order[]) {
        this.id = id;
        this.username = un;
        this.password = pw;
        this.firstName = fn;
        this.lastName = ln;
        this.email = email;
        this.dob = dob;
        this.activeOrders = ao;
        this.closedOrders = co;
    }

};