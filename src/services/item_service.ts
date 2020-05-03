import { Item } from "../models/item";
import { ItemRepository } from "../repos/item_repo";
import { isValidId, isValidStrings, isValidObject, isPropertyOf, isEmptyObject } from "../util/validator";
import { BadRequestError, ResourceNotFoundError, NotImplementedError, ResourcePersistenceError, AuthenticationError } from "../errors/errors";
import { query } from "express";

export class ItemService {

    constructor(private itemRepo: ItemRepository) {
        this.itemRepo = itemRepo;
    }

    async getAllItems(): Promise<Item[]> {

        let items = await this.itemRepo.getAll();

        if (items.length == 0) {
            throw new ResourceNotFoundError();
        }

        return items;

    }

    async getItemById(id: number): Promise<Item> {

        if (!isValidId(id)) {
            throw new BadRequestError();
        }

        let item = await this.itemRepo.getByID(id);

        if (isEmptyObject(item)) {
            throw new ResourceNotFoundError();
        }

        return item;

    }


    //Maybe add some sort of equivalent for:
    // getUserByUniqueKey(queryObj: any): Promise<User> {}
    // getUserByCredentials(un: string, pw: string): Promise<User> {}
    // authenticateUser(un: string, pw: string): Promise<User> {}


    async addNewItem(newItem: Item): Promise<Item> {
        
        if (!isValidObject(newItem, 'id')) {
            throw new BadRequestError('Invalid property values found in provided user.');
        }
        //consider re-using items.... if you do... check to see if they exist
        //before adding new ones!

        const persistedItem = await this.itemRepo.save(newItem);

        return persistedItem;

    }

    async updateItem(updatedItem: Item): Promise<boolean> {
        
        if (!isValidObject(updatedItem)) {
            throw new BadRequestError('Invalid user provided (invalid values found).');
        }

        // let repo handle some of the other checking since we are still mocking db
        return await this.itemRepo.update(updatedItem);

    }

    async deleteById(id: number): Promise<boolean> {
        
        if(!isValidId(id)) {
            throw new BadRequestError();
        }

        return await this.itemRepo.deleteById(id);

    }


}