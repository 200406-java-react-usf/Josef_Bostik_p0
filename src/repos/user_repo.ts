/** Remember CRUD - create read update delete
 * Functionality to be had in the user_repo:
 * 
 *          getAll()
 *          getUserById()
 *          getUserByUsername()
 *          getUserByCredentials()
 *          addNewUser()
 *          updateUser()
 */

import data from '../data/user_db';
import { User } from '../models/user';
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
import { mapUserResultSet } from '../util/result-set-mapper';

export class UserRepository implements CrudRepository<User> {

    baseQuery = `
        select
            au.id, 
            au.username, 
            au.password, 
            au.first_name,
            au.last_name,
            au.email,
            ur.name as role_name
        from app_users au
        join user_roles ur
        on au.role_id = ur.id
    `;

    async getAll(): Promise<User[]> {
        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = `${this.baseQuery}`;
            let rs = await client.query(sql); // rs = ResultSet
            return rs.rows.map(mapUserResultSet);
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    }

    async getByID(id: number): Promise<User> {

        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = `${this.baseQuery} where au.id = $1`;
            let rs = await client.query(sql, [id]);
            return mapUserResultSet(rs.rows[0]);
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    }


    //Doesnt check for validity (if a key really is unique)
    async getUserByUniqueKey(key: string, val: string): Promise<User> {

        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = `${this.baseQuery} where au.${key} = $1`;
            let rs = await client.query(sql, [val]);
            return mapUserResultSet(rs.rows[0]);
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }    
    }

    async getUserByCredentials(un: string, pw: string): Promise<User> {
        
        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = `${this.baseQuery} where au.username = $1 and au.password = $2`;
            let rs = await client.query(sql, [un, pw]);
            return mapUserResultSet(rs.rows[0]);
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    }

    async save(newUser: User): Promise<User> {

        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = ``;
            let rs = await client.query(sql, []);
            return mapUserResultSet(rs.rows[0]);
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    }

    async update(updatedUser: User): Promise<boolean> {
        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = ``;
            let rs = await client.query(sql, []);
            return true;
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    }

    //Not yet implemented
    async deleteById(id: number): Promise<Boolean> {
        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = ``;
            let rs = await client.query(sql, []);
            return true;
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    }
}