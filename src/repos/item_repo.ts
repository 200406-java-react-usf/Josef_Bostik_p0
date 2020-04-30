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
import Validator from '../util/validator';
import {
    ResourceNotFoundError,
    ResourcePersistenceError,
    BadRequestError,
    AuthenticationError,
    NotImplementedError
} from '../errors/errors';

export class ItemRepository implements CrudRepository<Item> {

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
            if (!Validator.isValidId(id)) {
                reject(new BadRequestError());
            }

            setTimeout(() => {
                
                const item = {...data.find(item => item.id === id)};

                if(Object.keys(item).length === 0) {
                    reject(new ResourceNotFoundError());
                    return;
                }

                resolve(item);

            }, 250);
        });
    }

    save(newItem: Item): Promise<Item> {
        return new Promise<Item>((resolve, reject) => {
            if (!Validator.isValidObject(newItem, 'id')) {
                reject(new BadRequestError('Invalid property values found in provided item.'));
                return;
            }
        
            setTimeout(() => {
        
        
                newItem.id = (data.length) + 1;
                data.push(newItem);
        
                resolve(newItem);
        
            });
        });
    }

    update(updatedItem: Item): Promise<Boolean> {
        return new Promise<Boolean>((resolve, reject) => {
            if (!Validator.isValidObject(updatedItem) || !Validator.isValidId(updatedItem.id)) {
                reject(new BadRequestError('Invalid item provided (invalid values found).'));
                return;
            }
        
            setTimeout(() => {
        
                let persistedItem = data.find(item => item.id === updatedItem.id);
        
                if (!persistedItem) {
                    reject(new ResourceNotFoundError('No item found with provided id.'));
                    return;
                }
    
                persistedItem = updatedItem;
    
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