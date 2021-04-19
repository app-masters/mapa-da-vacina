/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes/index.ts` as follows
|
| import './cart'
| import './customer'
|
*/

import Route from '@ioc:Adonis/Core/Route';
Route.get('/', async () => {
  return { hello: 'world' };
});

// Prefecture
Route.get('/prefecture', 'PrefecturesController.index');
Route.get('/prefecture/:id/:zip?', 'PrefecturesController.show');
Route.get('/prefectures-list/', 'PrefecturesController.listActive');

// User
Route.post('/invite', 'UsersController.invite').middleware(['authActive']);
Route.post('/validate-user', 'UsersController.validate').middleware(['auth']);

//Contact
Route.post('/contact', 'ContactsController.sendContact');

// Places
Route.post('/import-places', 'PlacesController.importPlacesFromCSV').middleware(['authActive']);

//Test
// Route.get('/test/sms', 'TestController.testSms');
