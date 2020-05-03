/** Remember CRUD - create read update delete
 * TODO:
 *      - addToOrder(itemID, orderID) --> 
 *          * calls getItemByID
 *          * adds item to orderContents
 *      
 *      REFACTOR TO USE SQL DATABASE & ASYNC
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
    NotImplementedError,
    InternalServerError
} from '../errors/errors';
import { PoolClient } from 'pg';
import { connectionPool } from '..';
import { mapOrderResultSet } from '../util/result-set-mapper';


export class OrderRepository implements CrudRepository<Order> {

    baseQuery = `
        select
            ao.id, 
            ao.customerid, 
            ao.status, 
            ao.location,
            ao.destination
        from app_orders ao
    `;

    async getAll(): Promise<Order[]> {

        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = `${this.baseQuery}`;
            let rs = await client.query(sql); // rs = ResultSet
            return rs.rows.map(mapOrderResultSet);
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    }

    async getByID(id: number): Promise<Order> {
        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = `${this.baseQuery} where au.id = $1`;
            let rs = await client.query(sql, [id]);
            return mapOrderResultSet(rs.rows[0]);
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    }

    async save(newOrder: Order): Promise<Order> {
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

    async update(updatedOrder: Order): Promise<boolean> {
        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = `
                update app_orders
                set customerid = $2, status = $3, location = $4, destination = $5
                where app_orders.id = $1;
            `;
            console.log(updatedOrder.customerId);

            let rs = await client.query(sql, [updatedOrder.id, updatedOrder.customerId, updatedOrder.status, updatedOrder.location, updatedOrder.destination]);
            return true;
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    }

    async deleteById(id: number): Promise<boolean> {
        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = `
                delete from app_orders where id = $1
            `;
            let rs = await client.query(sql, [id]);
            return true;
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    }

}