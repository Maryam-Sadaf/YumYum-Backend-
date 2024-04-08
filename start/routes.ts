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
Route.get('/', async () => {
  return { message: "Welcome to YumYum Food Delivery App Backend" }
})

//Auth
Route.post('api/user_signup', 'UsersController.signUp')
Route.post('api/user_login', 'UsersController.login')
Route.post('api/restaurant_signup', 'RestaurantsController.signUp')
Route.post('api/restaurant_login', 'RestaurantsController.login')

//MobileApp
Route.group(() => {
  //Users
  Route.get('/users', 'UsersController.show')
  Route.put('/users/:id', 'UsersController.update')
  Route.post('/user_logout', 'UsersController.logout')
  //Home
  Route.get('/all_restaurants', 'HomesController.allRestaurants')
  //Dishes
  Route.get('/dishes', 'DishesController.store')
  //Carts
  Route.post('/carts', 'CartsController.store')
  Route.get('/carts', 'CartsController.show')
  Route.put('/carts/:id', 'CartsController.update')
  Route.delete('/carts/:id?', 'CartsController.destroy')
  //Orders
  Route.post('/orders', 'OrdersController.store')
}).prefix('api').middleware(['auth:user_api'])

//WebApp
Route.group(() => {
  //Restaurants
  Route.get('/restaurants', 'RestaurantsController.show')
  Route.put('/restaurants/:id', 'RestaurantsController.update')
  Route.post('/restaurant_logout', 'RestaurantsController.logout')
  //Dishes
  Route.post('/dishes', 'DishesController.store')
  Route.get('/dishes', 'DishesController.show')
  Route.put('/dishes/:id', 'DishesController.update')
  Route.delete('/dishes/:id', 'DishesController.destroy')
  //Orders
  Route.get('/orders', 'OrdersController.show')
  Route.put('/orders/:id', 'OrdersController.update')
}).prefix('api').middleware(['auth:restaurant_api'])