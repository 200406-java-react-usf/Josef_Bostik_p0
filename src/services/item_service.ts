/**
 * The purpose of item_service ensures that all properties passed to item_repo are valid.
 */

import { Item } from "../models/item";
import { ItemRepository } from "../repos/item_repo";
import { isValidId, isValidStrings, isValidObject, isPropertyOf, isEmptyObject } from "../util/validator";
import { BadRequestError, ResourceNotFoundError, NotImplementedError, ResourcePersistenceError, AuthenticationError } from "../errors/errors";
import { query } from "express";

export class ItemService {

    constructor(private itemRepo: ItemRepository) {
        this.itemRepo = itemRepo;
    }

    /**
     * Retrieves all items from the itemRepo and returns them
     * if they exist.
     */
    async getAllItems(): Promise<Item[]> {

        let items = await this.itemRepo.getAll();

        if (items.length == 0) {
            throw new ResourceNotFoundError();
        }

        return items;

    }

    /**
     * Gets an item by its serial ID value
     */
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


    //Note to self: Maybe add some sort of equivalent for:
    // getUserByUniqueKey(queryObj: any): Promise<User> {}
    // getUserByCredentials(un: string, pw: string): Promise<User> {}
    // authenticateUser(un: string, pw: string): Promise<User> {}

    /**
     * Adds a new item to the database
     */
    async addNewItem(newItem: Item): Promise<Item> {
        
        if (!isValidObject(newItem, 'id')) {
            throw new BadRequestError('Invalid property values found in provided user.');
        }

        //Note to self: consider re-using items: if you do... 
        //check to see if the item exists in the database before 
        //adding new ones.

        const persistedItem = await this.itemRepo.save(newItem);

        return persistedItem;

    }

    /**
     * Updates an item at the specified index given a new item object and a
     * specified index
     */
    async updateItem(id: number, updatedItem: Item): Promise<boolean> {
        
        if (!isValidObject(updatedItem)) {
            throw new BadRequestError('Invalid item provided (invalid values found).');
        }

        // let repo handle some of the other checking since we are still mocking db
        updatedItem.id = id;
        
        return await this.itemRepo.update(updatedItem);

    }

    /**
     * Deletes an item given its serial ID
     */
    async deleteById(id: number): Promise<boolean> {
        
        if(!isValidId(id)) {
            throw new BadRequestError();
        }

        return await this.itemRepo.deleteById(id);

    }


}