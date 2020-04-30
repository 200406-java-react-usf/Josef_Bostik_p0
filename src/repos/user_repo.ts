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
    NotImplementedError
} from '../errors/errors';

export class UserRepository implements CrudRepository<User> {

    getAll(): Promise<User[]> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                let users: User[] = [];

                for (let user of data) {
                    users.push({...user});
                }

                if(users.length === 0) {
                    reject(new ResourceNotFoundError());
                    return;
                }
                
                resolve(users);
            }, 250);
        });
    }

    getByID(id: number): Promise<User> {
        return new Promise<User>((resolve, reject) => {
            
            if (!Validator.isValidId(id)) {
                reject(new BadRequestError());
            }

            setTimeout(() => {
                
                const user = {...data.find(user => user.id === id)};

                if(Object.keys(user).length === 0) {
                    reject(new ResourceNotFoundError());
                    return;
                }

                resolve(user);

            }, 250);

        });
    }


    //Doesnt check for validity (if a key really is unique)
    getUserByUniqueKey(key: string, val: string): Promise<User> {
        return new Promise<User>((resolve, reject) => {
            setTimeout(() => {
                const user = {...data.find(user => user[key] === val)};
                resolve(user);
            }, 250);
        });    
    }

    getUserByCredentials(un: string, pw: string): Promise<User> {
        
        return new Promise<User>((resolve, reject) => {
        
            setTimeout(() => {
                const user = {...data.find(user => user.username === un && user.password === pw)};
                resolve(user);  
            }, 250);

        });
    }

    save(newUser: User): Promise<User> {
        return new Promise<User>((resolve, reject) => {
        
            if (!Validator.isValidObject(newUser, 'id')) {
                reject(new BadRequestError('Invalid property values found in provided user.'));
                return;
            }
        
            setTimeout(() => {
        
                let conflict = data.filter(user => user.username == newUser.username).pop();
        
                if (conflict) {
                    reject(new ResourcePersistenceError('The provided username is already taken.'));
                    return;
                }
        
                conflict = data.filter(user => user.email == newUser.email).pop();
        
                if (conflict) {
                    reject(new ResourcePersistenceError('The provided email is already taken.'));
                    return;
                }
        
                newUser.id = (data.length) + 1;
                data.push(newUser);
        
                resolve(newUser);
        
            });

        });
    }

    update(updatedUser: User): Promise<Boolean> {
        return new Promise<boolean>((resolve, reject) => {

            if (!Validator.isValidObject(updatedUser) || !Validator.isValidId(updatedUser.id)) {
                reject(new BadRequestError('Invalid user provided (invalid values found).'));
                return;
            }
        
            setTimeout(() => {
        
                let persistedUser = data.find(user => user.id === updatedUser.id);
        
                if (!persistedUser) {
                    reject(new ResourceNotFoundError('No user found with provided id.'));
                    return;
                }
                
                if (persistedUser.username != updatedUser.username) {
                    reject(new ResourcePersistenceError('Usernames cannot be updated.'));
                    return;
                }
        
                const conflict = data.filter(user => {
                    if (user.id == updatedUser.id) return false;
                    return user.email == updatedUser.email; 
                }).pop();
        
                if (conflict) {
                    reject(new ResourcePersistenceError('Provided email is taken by another user.'));
                    return;
                }
    
                persistedUser = updatedUser;
    
                resolve(true);
        
            });

        });
    }

    //Not yet implemented
    deleteById(id: number): Promise<Boolean> {
        return new Promise<boolean>((resolve, reject) => {
            
            if (!Validator.isValidId(id)) {
                reject(new BadRequestError());
            }

            reject(new NotImplementedError());
        });
    }

    private removePassword(user: User): User {
        let usr = {...user};
        delete usr.password;
        return usr;   
    }
}