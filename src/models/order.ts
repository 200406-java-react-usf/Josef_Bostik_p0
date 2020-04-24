/**
 * Information to be stored in the order object:
 *      - orderID
 *      - orderContents
 *      - orderCost
 *      - orderStatus (open (true)/closed (false))
 *      - orderLoc ('delivered' if delivered, 'assembling' if items are in multiple loc's)
 */

import { Item } from '../models/item';

export class Order {
    
    id: number;
    customerId: number;
    contents: Item[];
    cost: Number;
    status: boolean;
    location: string;
    destination: string;

    constructor(ID: number, cid: number, con: Item[], stat: boolean, loc: string, des: string) {
        this.id = ID;
        this.customerId = cid;
        this.contents = con;
        this.cost = this.contents.reduce((a, b) => a + b.cost, 0);
        this.status = stat;
        this.location = loc;
        this.destination = des;
    }
}