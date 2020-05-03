import { UserRepoInstance } from '../config/app';
import { User } from '../models/user';
import Validator from '../util/validator';

let sut = new UserRepoInstance;

describe('userRepo', () => {

    // Set up external functions to throw errors by default (tests will configure if needed)
    beforeEach(() => {

        Validator.isValidId = jest.fn().mockImplementation(() => {
            throw new Error('Failed to mock external method: isValidId!');
        });

        Validator.isValidStrings = jest.fn().mockImplementation(() => {
            throw new Error('Failed to mock external method: isValidStrings!');
        });

        Validator.isValidObject = jest.fn().mockImplementation(() => {
            throw new Error('Failed to mock external method: isValidObject!');
        });

    });

    test('should be a singleton', () => {

        // Arrange
        expect.assertions(1);

        // Act
        let reference1 = sut.getInstance();
        let reference2 = sut.getInstance();

        // Assert
        expect(reference1).toEqual(reference2);

    });

    test('should return all users (with passwords) when getAll is called', async () => {
        
        // Arrange
        expect.assertions(3);

        // Act
        let result = await sut.getInstance().getAll();

        // Assert
        expect(result).toBeTruthy();
        //Assert
        expect(result.length).toBeGreaterThan(0);
        expect(result[0].password).toBe('password');

    });

    test('should return correct user (with password) when getById is given a valid id', async () => {
        
        // Arrange
        expect.assertions(3);
        Validator.isValidId = jest.fn().mockReturnValue(true);

        // Act
        let result = await sut.getInstance().getByID(1);

        // Assert
        expect(result).toBeTruthy();
        expect(result.id).toBe(1);
        expect(result.password).toBe('password');

    });

    test('should return correct user (with password) when getUserByUniqueKey is given a known username', async () => {
        
        // Arrange
        expect.assertions(3);
        Validator.isValidStrings = jest.fn().mockReturnValue(true);

        // Act
        let result = await sut.getInstance().getUserByUniqueKey('username', 'aanderson');

        // Assert
        expect(result).toBeTruthy();
        expect(result.username).toBe('aanderson');
        expect(result.password).toBe('password');
    
    });


    test('should return correct user (with password) when getUserByCredentials is given valid credentials', async () => {
        //Arrange
        expect.assertions(3);
        Validator.isValidStrings = jest.fn().mockReturnValue(true);
        //Act
        let result = await sut.getInstance().getUserByCredentials('aanderson', 'password');
        //Assert
        expect(result).toBeTruthy();
        expect(result.username).toBe('aanderson');
        expect(result.password).toBe('password');
        
    });

    test('should return true when update is given a valid updated user', async () => {
        //Arrange
        expect.assertions(1);
        Validator.isValidObject = jest.fn().mockReturnValue(true);
        Validator.isValidId = jest.fn().mockReturnValue(true);
        //Act
        let updatedUser = new User(1, 'aanderson', 'updated', 'updated', 'updated', 'updated@revature.com', 'User');
        let result = await sut.getInstance().update(updatedUser);
        //Assert
        expect(result).toBeTruthy();
    });

});