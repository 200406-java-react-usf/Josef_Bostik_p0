import { User } from "../models/user";
import { UserRepository } from "../repos/user_repo";
import { isValidId, isValidStrings, isValidObject, isPropertyOf, isEmptyObject } from "../util/validator";
import { 
    BadRequestError, 
    ResourceNotFoundError, 
    NotImplementedError, 
    ResourcePersistenceError, 
    AuthenticationError 
} from "../errors/errors";
import { query } from "express";

export class UserService {

    constructor(private userRepo: UserRepository) {
        this.userRepo = userRepo;
    }

    async getAllUsers(): Promise<User[]> {


        let users = await this.userRepo.getAll();

        if (users.length == 0) {
            throw new ResourceNotFoundError();
        }

        return users.map(this.removePassword);


    }

    async getUserById(id: number): Promise<User> {



        if (!isValidId(id)) {
            throw new BadRequestError();
        }

        let user = await this.userRepo.getByID(id);

        if (isEmptyObject(user)) {
            throw new ResourceNotFoundError();
        }

        return this.removePassword(user);


    }

    async getUserByUniqueKey(queryObj: any): Promise<User> {

        let queryKeys = Object.keys(queryObj);

        if(!queryKeys.every(key => isPropertyOf(key, User))) {
            throw new BadRequestError();
        }

        // we will only support single param searches (for now)
        let key = queryKeys[0];
        let val = queryObj[key];

        // if they are searching for a user by id, reuse the logic we already have
        if (key === 'id') {
            return await this.getUserById(+val);
        }

        // ensure that the provided key value is valid
        if(!isValidStrings(val)) {
            throw new BadRequestError();
        }

        let user = await this.userRepo.getUserByUniqueKey(key, val);

        if (isEmptyObject(user)) {
            throw new ResourceNotFoundError();
        }

        return this.removePassword(user);

    }

    async getUserByCredentials(un: string, pw: string): Promise<User> {
        
    
        try {
            const user = {...await this.userRepo.getUserByCredentials(un, pw)};
            return user;  
        } catch (e) {
            return e;
        }

    }

    async authenticateUser(un: string, pw: string): Promise<User> {


        if (!isValidStrings(un, pw)) {
            throw new BadRequestError();
        }

        let authUser: User;
        
        authUser = await this.userRepo.getUserByCredentials(un, pw);
        

        if (isEmptyObject(authUser)) {
            throw new AuthenticationError('Bad credentials provided.');
        }

        return this.removePassword(authUser);


    }

    async addNewUser(newUser: User): Promise<User> {
        

        if (!isValidObject(newUser, 'id')) {
            throw new BadRequestError('Invalid property values found in provided user.');
        }

        let usernameAvailable = await this.isUsernameAvailable(newUser.username);

        if (!usernameAvailable) {
            throw new ResourcePersistenceError('The provided username is already taken.');
        }
    
        let emailAvailable = await this.isEmailAvailable(newUser.email);

        if (!emailAvailable) {
            throw new  ResourcePersistenceError('The provided email is already taken.');
        }

        newUser.role = 'User'; // all new registers have 'User' role by default
        const persistedUser = await this.userRepo.save(newUser);

        return this.removePassword(persistedUser);


    }

    async updateUser(id: number, updatedUser: User): Promise<boolean> {

        

        if (!isValidObject(updatedUser, 'id')) {
            throw new BadRequestError('Invalid property values found in provided user.');
        }

        let usernameAvailable = await this.isUsernameAvailable(updatedUser.username, id);

        if (!usernameAvailable) {
            throw new ResourcePersistenceError('The provided username is already taken.');
        }
    
        let emailAvailable = await this.isEmailAvailable(updatedUser.email, id);

        if (!emailAvailable) {
            throw new  ResourcePersistenceError('The provided email is already taken.');
        }

        // let repo handle some of the other checking since we are still mocking db
        
        updatedUser.id = id;
        updatedUser.role = 'User'; // all new registers have 'User' role by default
        
        return await this.userRepo.update(updatedUser);

    }

    async deleteById(id: number): Promise<boolean> {
        
        if(!isValidId(id)) {
            throw new BadRequestError();
        }

        return await this.userRepo.deleteById(id);
    }

    private async isUsernameAvailable(username: string, id?: number): Promise<boolean> {

        try {
            if (await (await this.getUserByUniqueKey({'username': username})).id == id) {
                return true;
            }
        } catch (e) {
            console.log('username is available')
            return true;
        }

        console.log('username is unavailable')
        return false;

    }

    private async isEmailAvailable(email: string, id?: number): Promise<boolean> {
        
        try {
            if (await (await this.getUserByUniqueKey({'email': email})).id == id) {
                console.log('email at id');
                return true;
            }
        } catch (e) {
            console.log('email is available')
            return true;
        }

        console.log('email is unavailable')
        return false;
    }

    private removePassword(user: User): User {
        if(!user || !user.password) return user;
        let usr = {...user};
        delete usr.password;
        return usr;   
    }

}