/** Remember CRUD - create read update delete
 * TODO:
 *      - addToOrder(itemID, orderID) --> 
 *          * calls getItemByID
 *          * adds item to orderContents
 *      
 *      REFACTOR TO USE SQL DATABASE & ASYNC
 *      CREATE ORDERCOST METHOD
 */
import { Order } from '../models/order';
import { CrudRepository } from './crud_repo';
import {
    InternalServerError
} from '../errors/errors';
import { PoolClient } from 'pg';
import { connectionPool } from '..';
import { mapOrderResultSet } from '../util/result-set-mapper';

let baseQuery = `
    select
        ao.id, 
        ao.customerid, 
        ao.status, 
        ao.location,
        ao.destination
    from app_orders ao
`;

export async function  getAll(): Promise<Order[]> {

    let client: PoolClient;

    try {
        client = await connectionPool.connect();
        let sql = `${baseQuery}`;
        let rs = await client.query(sql); // rs = ResultSet
        return rs.rows.map(mapOrderResultSet);
    } catch (e) {
        throw new InternalServerError();
    } finally {
        client && client.release();
    }
}

export async function  getByID(id: number): Promise<Order> {
    let client: PoolClient;

    try {
        client = await connectionPool.connect();
        let sql = `${baseQuery} where au.id = $1`;
        let rs = await client.query(sql, [id]);
        return mapOrderResultSet(rs.rows[0]);
    } catch (e) {
        throw new InternalServerError();
    } finally {
        client && client.release();
    }
}

export async function  save(newOrder: Order): Promise<Order> {
    let client: PoolClient;

    try {
        client = await connectionPool.connect();
        let sql = `
            insert into app_orders (customerid, status, location, destination) 
            values ($1, $2, $3, $4) returning id
        `;
        let rs = await client.query(sql, [newOrder.customerId, newOrder.status, newOrder.location, newOrder.destination]);
        return mapOrderResultSet(rs.rows[0]);
    } catch (e) {
        throw new InternalServerError();
    } finally {
        client && client.release();
    }
}

export async function  update(updatedOrder: Order): Promise<boolean> {
    let client: PoolClient;

    try {
        client = await connectionPool.connect();
        let sql = `
            update app_orders
            set customerid = $2, status = $3, location = $4, destination = $5
            where app_orders.id = $1;
        `;
        console.log(updatedOrder.customerId);

        await client.query(sql, [updatedOrder.id, updatedOrder.customerId, updatedOrder.status, updatedOrder.location, updatedOrder.destination]);
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
            delete from app_orders where id = $1
        `;
        await client.query(sql, [id]);
        return true;
    } catch (e) {
        throw new InternalServerError();
    } finally {
        client && client.release();
    }
}

