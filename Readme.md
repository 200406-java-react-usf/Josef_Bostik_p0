The purpose of this project is to create a basic online ordering system API, incorporating TypeScript, PostGreSQL, node-postgre, express, jest, and Git SCM. The primary functionality of this API is to create, read, update, and delete data from a database created in PostGreSQL, hosted by AWS. The method used to interface with the API is HTTP. In this project, there are three data types: Users, Items, and Orders. Each user is to have 0-n orders, and each order is to have 1-n items.

AUTHENTICATE <br />
[POST] /auth : Authenticates user <br />

USERS <br />
[GET] /users : Gets all users <br />
[GET] /users/:id : Gets user :id  <br />
[GET] /users/:id/orders : Gets all the users orders with the specified :id <br />
[POST] /users : Posts a user given a JSON with user properties <br />
[DELETE] /users/:id : Deletes a user with serial :id <br />
[PATCH] /users/:id : Patches a user given a JSON with user properties <br />

ORDERS <br />
[GET] /orders : Gets all orders <br />
[GET] /orders/:id : Gets order :id <br />
[GET] /orders/:id/items : Gets all items at the order :id <br />
[POST] /orders/:id : Posts an order at :id given a JSON with order properties <br />
[PATCH] /orders/:id : Patches an order at :id given a JSON with order properties <br />
[DELETE] /orders/:id : Deletes an order at :id <br />

GET <br />
[GET] /items : Gets all items <br />
[GET] /items/:id Gets item :id <br />
[POST] /items/:id : Posts item at :id given a JSON with item properties <br />
[PATCH] /items/:id : Patches an item at :id given a JSON with item properties <br />
[DELETE] /items/:id : Deletes an item given :id <br />

![](images/ER_diagram6.png)


