import { Order } from '../models/order';
import { Item } from '../models/item';

let id: number = 1;

let item1 = new Item(3, 'Generic Brand Pasta', 'Spaghetti 0.5 lbs', 3.99, 'Seattle, Washington', 1, 1);
let item2 = new Item(2, 'MalWart H2O', 'Water', 0.99, 'Seattle, Washington', 1, 3);
let item3 = new Item(1, 'Colgate Anti-cavity', 'Colgate Toothpaste', 3.99, 'Seattle, Washington', 1, 1);
let item4 = new Item(1, 'Colgate Anti-cavity', 'Colgate Toothpaste', 3.99, 'Seattle, Washington', 2, 5);
let item5 = new Item(2, 'MalWart H2O', 'Water', 0.99, 'Seattle, Washington', 2, 3);

export default [
    new Order(id++, 1, [item1, item2, item3], true, "Seattle, Washington", "New York City, New York"),
    new Order(id++, 2, [item4, item5], true, "Seattle, Washington", "New York City, New York")
];