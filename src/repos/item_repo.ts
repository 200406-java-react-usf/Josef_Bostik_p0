/** Remember CRUD - create read update delete
 * Functionality to be had in the item_repo:
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
 *      - getFirstAvailable(itemName) --> probably depricated
 *          * inputs itemName
 *          * looks through itemDatabase to find first available item with that name
 *          * returns item
 */

import { Item } from '../models/item';
import { CrudRepository } from './crud_repo';
import {
    InternalServerError
} from '../errors/errors';
import { PoolClient } from 'pg';
import { connectionPool } from '..';
import { mapItemResultSet } from '../util/result-set-mapper';


let baseQuery = `
    select
        ai.id, 
        ai.name, 
        ai.description, 
        ai.cost,
        ai.amount
    from app_items ai
`;

export async function getAll(): Promise<Item[]> {
    let client: PoolClient;

    try {
        client = await connectionPool.connect();
        let sql = `${baseQuery}`;
        let rs = await client.query(sql); // rs = ResultSet
        return rs.rows.map(mapItemResultSet);
    } catch (e) {
        throw new InternalServerError();
    } finally {
        client && client.release();
    }
}

export async function  getByID(id: number): Promise<Item> {

    let client: PoolClient;

    try {
        client = await connectionPool.connect();
        let sql = `${baseQuery} where au.id = $1`;
        let rs = await client.query(sql, [id]);
        return mapItemResultSet(rs.rows[0]);
    } catch (e) {
        throw new InternalServerError();
    } finally {
        client && client.release();
    }
}

export async function  save(newItem: Item): Promise<Item> {
    let client: PoolClient;

    try {
        client = await connectionPool.connect();
        let sql = `
            insert into app_items (name, description, cost, amount) 
            values ($1, $2, $3, $4) returning id
        `;
        let rs = await client.query(sql, [newItem.name, newItem.description, newItem.cost, newItem.amount]);
        return mapItemResultSet(rs.rows[0]);
    } catch (e) {
        throw new InternalServerError();
    } finally {
        client && client.release();
    }
}

export async function  update(updatedItem: Item): Promise<boolean> {
    let client: PoolClient;

    try {
        client = await connectionPool.connect();
        let sql = `
            update app_items
            set name = $2, description = $3, cost = $4, amount = $5
            where app_items.id = $1;
        `;
        await client.query(sql, [updatedItem.id, updatedItem.name, updatedItem.description, updatedItem.cost, updatedItem.amount]);
        return true;
    } catch (e) {
        throw new InternalServerError();
    } finally {
        client && client.release();
    }
}


export async function  deleteById(id: number): Promise<boolean> {
    let client: PoolClient;

    try {
        client = await connectionPool.connect();
        let sql = `
            delete from app_items where id = $1
        `;
        await client.query(sql, [id]);
        return true;
    } catch (e) {
        throw new InternalServerError();
    } finally {
        client && client.release();
    }
}

