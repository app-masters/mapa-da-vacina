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
Route.get('/prefectures', 'PrefecturesController.index');
Route.post('/prefectures', 'PrefecturesController.store');
Route.get('/prefectures/:id', 'PrefecturesController.show');
Route.delete('/prefectures/:id', 'PrefecturesController.destroy');

// User
Route.post('/invite', 'UsersController.invite').middleware(['auth']);

//Test
Route.get('/test/sms', 'TestController.testSms');
