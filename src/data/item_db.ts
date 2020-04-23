import { Item } from '../models/item';

let id: number = 1;

export default [
    new Item(id++, 'Anti-cavity', 'Colgate Toothpaste', 3.99, 'Seattle, Washington', 0, 235),
    new Item(id++, 'H2O', 'Water', 0.99, 'Seattle, Washington', 0, 50)
];