/** Remember CRUD - create read update delete
 * Functionality to be had in the item_repo:
 *      - getAll()
 *      - getItemByID(itemID)
 *          * inputs itemID
 *          * returns item
 *      - getItemName(itemID)
 *          * calls getItemByID
 *          * returns name
 *      - getItemDescription(itemID)
 *          * calls getItemByID
 *          * returns Description
 *      - getItemCost(itemID)
 *          * calls getItemByID
 *          * returns Cost
 *      - getItemLoc(itemID) 
 *          * calls getItemByID
 *          * returns Loc
 *      - getItemStatus(itemID) 
 *          * calls getItemByID
 *          * returns status
 *      - addToOrder(itemID, orderID) 
 *          * calls getItemByID
 *          * changes item status to orderID
 *      - getFirstAvailable(itemName)
 *          * inputs itemName
 *          * looks through itemDatabase to find first available item with that name
 *          * returns item
 *      - addNewItem(item, amount)
 *      - updateItem(olditem, newitem)
 */

import data from '../data/item_db';
import { Item } from '../models/item';
import { CrudRepository } from './crud_repo';
import {
    ResourceNotFoundError,
    ResourcePersistenceError,
    BadRequestError,
    AuthenticationError,
    NotImplementedError
} from '../errors/errors';

class itemRepository implements CrudRepository<Item> {

    getAll(): Promise<Item[]> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                let items: Item[] = [];

                for (let item of data) {
                    items.push({...item});
                }

                if(items.length === 0) {
                    reject(new ResourceNotFoundError());
                    return;
                }
                
                resolve(items);
            }, 250);
        });
    }

    getByID(id: number): Promise<Item> {
        return new Promise<Item>((resolve, reject) => {
            reject(new NotImplementedError());
        });
    }

    save(newObj: Item): Promise<Item> {
        return new Promise<Item>((resolve, reject) => {
            reject(new NotImplementedError());
        });
    }

    update(updatedObj: Item): Promise<Boolean> {
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