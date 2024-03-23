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
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => "Welcome to YumYum Food Delivery App Backend")

//Auth
Route.post('api/signup', 'UsersController.signUp')
Route.post('api/login', 'UsersController.login')

Route.group(() => {
  //Users
  Route.get('/users', 'UsersController.show')
  Route.put('/users/:id', 'UsersController.update')
  Route.post('/logout', 'UsersController.logout')
}).prefix('api').middleware(['auth'])