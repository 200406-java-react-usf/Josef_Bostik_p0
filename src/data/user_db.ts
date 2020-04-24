import { User } from "../models/user";
import data from '../data/order_db'

let id: number = 1;

export default [
    new User(id++, 'aanderson', 'password', 'Alice', 'Anderson', 'aanderson@revature.com', new Date('01/01/1995'), [data[0]], null),
    new User(id++, 'bbailey', 'password', 'Bob', 'Bailey', 'bbailey@revature.com', new Date('01/01/1983'), [data[1]], null),
    new User(id++, 'ccountryman', 'password', 'Charlie', 'Countryman', 'ccountryman@revature.com', new Date('01/01/1990'), null, null),
    new User(id++, 'ddavis', 'password', 'Daniel', 'Davis', 'ddavis@revature.com', new Date('07/01/1990'), null, null),
    new User(id++, 'eeinstein', 'password', 'Emily', 'Einstein', 'eeinstein@revature.com', new Date('09/01/1993'), null, null)
];