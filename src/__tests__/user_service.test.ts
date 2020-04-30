import { UserService } from '../services/user_service';
import { UserRepository } from '../repos/user_repo';
import { User } from '../models/user';
import Validator from '../util/validator';
import { ResourceNotFoundError, BadRequestError, AuthenticationError, ResourcePersistenceError } from '../errors/errors';

describe('userService', () => {

    let sut: UserService;
    let mockRepo: UserRepository = new UserRepository();

    let mockUsers = [
        new User(1, 'aanderson', 'password', 'Alice', 'Anderson', 'aanderson@revature.com', 'Admin'),
        new User(2, 'bbailey', 'password', 'Bob', 'Bailey', 'bbailey@revature.com', 'User'),
        new User(3, 'ccountryman', 'password', 'Charlie', 'Countryman', 'ccountryman@revature.com', 'User'),
        new User(4, 'ddavis', 'password', 'Daniel', 'Davis', 'ddavis@revature.com', 'User'),
        new User(5, 'eeinstein', 'password', 'Emily', 'Einstein', 'eeinstein@revature.com', 'User')
    ];

    beforeEach(() => {

        sut = new UserService(mockRepo);

        // Reset all external methods
        for (let method in UserRepository.prototype) {
            UserRepository.prototype[method] = jest.fn().mockImplementation(() => {
                throw new Error(`Failed to mock external method: UserRepository.${method}!`);
            });
        }
    
    });

    test('should resolve to User[] (without passwords) when getAllUsers() successfully retrieves users from the data source', async () => {

        // Arrange
        expect.hasAssertions();
        UserRepository.prototype.getAll = jest.fn().mockReturnValue(mockUsers);

        // Act
        let result = await sut.getAllUsers();

        // Assert
        expect(result).toBeTruthy();
        expect(result.length).toBe(5);
        result.forEach(val => expect(val.password).toBeUndefined());

    });

    test('should reject with ResourceNotFoundError when getAllUsers fails to get any users from the data source', async () => {

        // Arrange
        expect.assertions(1);
        UserRepository.prototype.getAll = jest.fn().mockReturnValue([]);

        // Act
        try {
            await sut.getAllUsers();
        } catch (e) {

            // Assert
            expect(e instanceof ResourceNotFoundError).toBe(true);
        }

    });

    test('should resolve to User when getUserById is given a valid an known id', async () => {

        // Arrange
        expect.assertions(3);
        
        Validator.isValidId = jest.fn().mockReturnValue(true);

        UserRepository.prototype.getByID = jest.fn().mockImplementation((id: number) => {
            return new Promise<User>((resolve) => resolve(mockUsers[id - 1]));
        });


        // Act
        let result = await sut.getUserById(1);

        // Assert
        expect(result).toBeTruthy();
        expect(result.id).toBe(1);
        expect(result.password).toBeUndefined();

    });

    test('should reject with BadRequestError when getUserById is given a invalid value as an id (decimal)', async () => {

        // Arrange
        expect.hasAssertions();
        UserRepository.prototype.getByID = jest.fn().mockReturnValue(false);

        // Act
        try {
            await sut.getUserById(3.14);
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with BadRequestError when getUserById is given a invalid value as an id (zero)', async () => {

        // Arrange
        expect.hasAssertions();
        UserRepository.prototype.getByID = jest.fn().mockReturnValue(false);

        // Act
        try {
            await sut.getUserById(0);
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with BadRequestError when getUserById is given a invalid value as an id (NaN)', async () => {

        // Arrange
        expect.hasAssertions();
        UserRepository.prototype.getByID = jest.fn().mockReturnValue(false);

        // Act
        try {
            await sut.getUserById(NaN);
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with BadRequestError when getUserById is given a invalid value as an id (negative)', async () => {

        // Arrange
        expect.hasAssertions();
        UserRepository.prototype.getByID = jest.fn().mockReturnValue(false);

        // Act
        try {
            await sut.getUserById(-2);
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with ResourceNotFoundError if getByid is given an unknown id', async () => {

        // Arrange
        expect.hasAssertions();
        UserRepository.prototype.getByID = jest.fn().mockReturnValue(true);

        // Act
        try {
            await sut.getUserById(9999);
        } catch (e) {

            // Assert
            expect(e instanceof ResourceNotFoundError).toBe(true);
        }

    });




    //ALL OF THE BELOW: added from old user_repo tests, revise



//     test('should throw ResourceNotFoundError when getUserByUniqueKey is given an unknown username', async () => {
//         //Arrange
//         expect.assertions(1);
//         Validator.isValidStrings = jest.fn().mockReturnValue(true); //unknown username should still be a valid string, maybe I can implement isValidUser later?
        
//         UserRepository.prototype.getUserByUniqueKey = jest.fn().mockReturnValue(false);

//         try {
//             //Act
//             await sut.getUserByUniqueKey('nobody');
//         } catch (e) {
//             //Assert
//             expect(e instanceof ResourceNotFoundError).toBeTruthy();
//         }
        
//     });

//     test('should throw BadRequestError when getUserByUsername is given bad data', async () => {
//         //Arrange
//         expect.assertions(1);
//         Validator.isValidStrings = jest.fn().mockReturnValue(false);
//         try {
//             //Act
//             await sut.getUserByUniqueKey('');
//         } catch (e) {
//             //Assert
//             expect(e instanceof BadRequestError).toBeTruthy();
//         }
//     });

//     test('should throw AuthenticationError when getUserByCredentials is given incorrect credentials', async () => {
//         //Arrange
//         expect.assertions(1);
//         Validator.isValidStrings = jest.fn().mockReturnValue(true); //incorrect credentials are still valid strings.
//         try {
//             //Act
//             await sut.getUserByCredentials('aanderson', 'wrong');
//         } catch(e) {
//             //Assert
//             expect(e instanceof AuthenticationError).toBeTruthy();
//         }
//     });


//     test('should throw BadRequestError when getUserByCredentials is given bad data', async () => {
//         //Arrange
//         expect.assertions(1);
//         Validator.isValidStrings = jest.fn().mockReturnValue(false);
//         try {
//             //Act
//             await sut.getUserByCredentials('', '');
//         } catch(e) {
//             //Assert
//             expect(e instanceof BadRequestError).toBeTruthy();
//         }
//     });

//     test('should return a user (without password) that has a new id when save is given a valid new user', async () => {
//         //Arrange
//         expect.assertions(3);
//         Validator.isValidObject = jest.fn().mockReturnValue(true);
//         //Act
//         let validMockUser = new User(0, 'test', 'test', 'test', 'test', 'test@revature.com', 'User');
//         let result = await sut.addNewUser(validMockUser);
//         //Assert
//         expect(result).toBeTruthy();
//         expect(result.id).toBeGreaterThan(0);
//         expect(result.password).toBeUndefined();
//     });

//     test('should invoke error callback when addNewUser is given a new user with a conflicting username', async () => {
//         //Arrange
//         expect.assertions(1);
//         Validator.isValidObject = jest.fn().mockReturnValue(true);
//         //Act
//         let conflictingMockUser = new User(0, 'aanderson', 'test', 'test', 'test', 'test@revature.com', 'User');
//         try {
//             await sut.addNewUser(conflictingMockUser);
//         } catch (e) {
//             //Assert
//             expect(e instanceof ResourcePersistenceError).toBeTruthy();
//         }

//     });

//     test('should throw ResourcePersistenceError when save is given a new user with a conflicting email', async () => {
//         //Arrange
//         expect.assertions(1);
//         Validator.isValidObject = jest.fn().mockReturnValue(true);
//         //Act
//         let conflictingMockUser = new User(0, 'a', 'a', 'a', 'a', 'aanderson@revature.com', 'User');
//         try {
//             await sut.addNewUser(conflictingMockUser);
//         } catch (e) {
//             //Assert
//             expect(e instanceof ResourcePersistenceError).toBeTruthy();
//         }

//     });

//     test('should throw BadRequestError when save is given an invalid new user (falsy username)', async () => {
//         //Arrange
//         expect.assertions(1);
//         Validator.isValidObject = jest.fn().mockReturnValue(false);
//         //Act
//         let invalidMockUser = new User(0, '', 'a', 'a', 'a', 'a@revature.com', 'User');
//         try {
//             await sut.addNewUser(invalidMockUser);
//         } catch (e) {
//             //Assert
//             expect(e instanceof BadRequestError).toBeTruthy();
//         }
//     });

//     test('should throw BadRequestError when save is given an invalid new user (falsy password)', async () => {
//         //Arrange
//         expect.assertions(1);
//         Validator.isValidObject = jest.fn().mockReturnValue(false);
//         //Act
//         let invalidMockUser = new User(0, 'a', '', 'a', 'a', 'a@revature.com', 'User');
//         try {
//             await sut.addNewUser(invalidMockUser);
//         } catch (e) {
//             //Assert
//             expect(e instanceof BadRequestError).toBeTruthy();
//         }
//     });

//     test('should throw BadRequestError when save is given an invalid new user (falsy firstName)', async () => {
//         //Arrange
//         expect.assertions(1);
//         Validator.isValidObject = jest.fn().mockReturnValue(false);
//         //Act
//         let invalidMockUser = new User(0, 'a', 'a', '', 'a', 'a@revature.com', 'User');
//         try {
//             await sut.addNewUser(invalidMockUser);
//         } catch (e) {
//             //Assert
//             expect(e instanceof BadRequestError).toBeTruthy();
//         }
//     });

//     test('should throw BadRequestError when save is given an invalid new user (falsy lastName)', async () => {    
//         //Arrange
//         expect.assertions(1);
//         Validator.isValidObject = jest.fn().mockReturnValue(false);
//         //Act
//         let invalidMockUser = new User(0, 'a', 'a', 'a', 'a', '', 'User');
//         try {
//             await sut.addNewUser(invalidMockUser);
//         } catch (e) {
//             //Assert
//             expect(e instanceof BadRequestError).toBeTruthy();
//         }
//     });


//     test('should throw BadRequestError when save is given a falsy user', async () => {
//         //Arrange
//         expect.assertions(1);
//         Validator.isValidObject = jest.fn().mockReturnValue(false);
//         try {
//             //Act
//             await sut.addNewUser(null);
//         } catch (e) {
//             //Assert
//             expect(e instanceof BadRequestError).toBeTruthy();
//         }
//     });

//     test('should throw ResourceNotFoundError when update is given an updated user with an unknown id', async () => {
//         //Arrnage
//         expect.assertions(1);
//         Validator.isValidObject = jest.fn().mockReturnValue(true);
//         Validator.isValidId = jest.fn().mockReturnValue(true); //unknown id's are still valid
//         //Act
//         let updatedUser = new User(999999, 'updated', 'updated', 'updated', 'updated', 'updated@revature.com', 'User');
//         try {
//             await sut.updateUser(updatedUser);
//         } catch (e) {
//             //Assert
//             expect(e instanceof ResourceNotFoundError).toBeTruthy();
//         }
//     });

//     test('should throw BadRequestError when update is given an updated user with an invalid id (decimal)', async () => {
//         //Arrange
//         expect.assertions(1);
//         Validator.isValidObject = jest.fn().mockReturnValue(true);
//         Validator.isValidId = jest.fn().mockReturnValue(false);
//         //Act
//         let updatedUser = new User(3.14, 'updated', 'updated', 'updated', 'updated', 'updated@revature.com', 'User');
//         try {
//             await sut.updateUser(updatedUser);
//         } catch (e) {
//             //Assert
//             expect(e instanceof BadRequestError).toBeTruthy();
//         }
//     });

//     test('should throw BadRequestError when update is given an updated user with an invalid id (negative)', async () => {
//         //Arrange
//         expect.assertions(1);
//         Validator.isValidObject = jest.fn().mockReturnValue(true);
//         Validator.isValidId = jest.fn().mockReturnValue(false);
//         //Act
//         let updatedUser = new User(-1, 'updated', 'updated', 'updated', 'updated', 'updated@revature.com', 'User');
//         try {
//             await sut.updateUser(updatedUser);
//         } catch (e) {
//             //Assert
//             expect(e instanceof BadRequestError).toBeTruthy();
//         }
//     });

//     test('should throw ResourcePersistenceError when update is given an updated user with an updated username', async () => {
//         //Arrange
//         expect.assertions(1);
//         Validator.isValidObject = jest.fn().mockReturnValue(true);
//         Validator.isValidId = jest.fn().mockReturnValue(true);
//         //Act
//         let updatedUser = new User(1, 'updated', 'updated', 'updated', 'updated', 'updated@revature.com', 'User');
//         try {
//             await sut.updateUser(updatedUser);
//         } catch (e) {
//             //Assert
//             expect(e instanceof ResourcePersistenceError).toBeTruthy();
//         }
//     });

//     test('should throw ResourcePersistenceError when update is given an updated user with a conflicting username', async () => {
//         //Arrange
//         expect.assertions(1);
//         Validator.isValidObject = jest.fn().mockReturnValue(true);
//         Validator.isValidId = jest.fn().mockReturnValue(true);
//         //Act
//         let updatedUser = new User(1, 'bbailey', 'updated', 'updated', 'updated', 'updated@revature.com', 'User');
//         try {
//             await sut.updateUser(updatedUser);
//         } catch (e) {
//             //Assert
//             expect(e instanceof ResourcePersistenceError).toBeTruthy();
//         }
//     });

//     test('should throw ResourcePersistenceError when update is given an updated user with a conflicting email', async () => {
//         //Arrange
//         expect.assertions(1);
//         Validator.isValidObject = jest.fn().mockReturnValue(true);
//         Validator.isValidId = jest.fn().mockReturnValue(true);
//         //Act
//         let updatedUser = new User(1, 'aanderson', 'updated', 'updated', 'updated', 'bbailey@revature.com', 'User');
//         try {
//             await sut.updateUser(updatedUser);
//         } catch (e) {
//             //Assert
//             expect(e instanceof ResourcePersistenceError).toBeTruthy();
//         }
//     });

//     test('should throw BadRequestError when update is given an invalid updated user (falsy username)', async () => {
//         //Arrange
//         expect.assertions(1);
//         Validator.isValidObject = jest.fn().mockReturnValue(false);
//         Validator.isValidId = jest.fn().mockReturnValue(true);
//         //Act
//         let updatedUser = new User(1, '', 'updated', 'updated', 'updated', 'bbailey@revature.com', 'User');
//         try {
//             await sut.updateUser(updatedUser);
//         } catch (e) {
//             //Assert
//             expect(e instanceof BadRequestError).toBeTruthy();
//         }
//     });

//     test('should throw BadRequestError when update is given an invalid updated user (falsy password)', async () => {
//         //Arrange
//         expect.assertions(1);
//         Validator.isValidObject = jest.fn().mockReturnValue(false);
//         Validator.isValidId = jest.fn().mockReturnValue(true);
//         //Act
//         let updatedUser = new User(1, 'aanderson', '', 'updated', 'updated', 'bbailey@revature.com', 'User');
//         try {
//             await sut.updateUser(updatedUser);
//         } catch (e) {
//             //Assert
//             expect(e instanceof BadRequestError).toBeTruthy();
//         }
//     });

//     test('should throw BadRequestError when update is given an invalid updated user (falsy firstName)', async () => {
//         //Arrange
//         expect.assertions(1);
//         Validator.isValidObject = jest.fn().mockReturnValue(false);
//         Validator.isValidId = jest.fn().mockReturnValue(true);
//         //Act
//         let updatedUser = new User(1, 'aanderson', 'updated', '', 'updated', 'bbailey@revature.com', 'User');
//         try {
//             await sut.updateUser(updatedUser);
//         } catch (e) {
//             //Assert
//             expect(e instanceof BadRequestError).toBeTruthy();
//         }
//     });

//     test('should throw BadRequestError when update is given an invalid updated user (falsy lastName)', async () => {
//         //Arrange
//         expect.assertions(1);
//         Validator.isValidObject = jest.fn().mockReturnValue(false);
//         Validator.isValidId = jest.fn().mockReturnValue(true);
//         //Act
//         let updatedUser = new User(1, 'aanderson', 'updated', 'updated', '', 'bbailey@revature.com', 'User');
//         try {
//             await sut.updateUser(updatedUser);
//         } catch (e) {
//             //Assert
//             expect(e instanceof BadRequestError).toBeTruthy();
//         }
//     });

//     test('should throw BadRequestError when update is given an invalid updated user (falsy email)', async () => {
//         //Arrange
//         expect.assertions(1);
//         Validator.isValidObject = jest.fn().mockReturnValue(false);
//         Validator.isValidId = jest.fn().mockReturnValue(true);
//         //Act
//         let updatedUser = new User(1, 'aanderson', 'updated', 'updated', 'updated', '', 'User');
//         try {
//             await sut.updateUser(updatedUser);
//         } catch (e) {
//             //Assert
//             expect(e instanceof BadRequestError).toBeTruthy();
//         }
//     });


//     test('should throw BadRequestError when update is given an falsy user', async () => {
//         //Arrange
//         expect.assertions(1);
//         Validator.isValidObject = jest.fn().mockReturnValue(false);
//         Validator.isValidId = jest.fn().mockReturnValue(true);
//         try {
//             //Act
//             await sut.updateUser(null);
//         } catch (e) {
//             //Assert
//             expect(e instanceof BadRequestError).toBeTruthy();
//         }
//     });

//     test('should throw BadRequestError when getById is given an invalid id', async () => {

//         // Arrange
//         expect.assertions(1);
//         Validator.isValidId = jest.fn().mockReturnValue(false);

//         // Act
//         try {
//             //Act
//             await sut.getUserById(-1);
//         } catch (e) {

//             // Assert
//             expect(e instanceof BadRequestError).toBeTruthy();
//         }
//     });


});