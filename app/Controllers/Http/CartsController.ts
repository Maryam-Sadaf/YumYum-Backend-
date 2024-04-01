import Application from '@ioc:Adonis/Core/Application';
import { Response } from 'App/Utils/ApiUtil';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Cart from 'App/Models/Cart';
import Dish from 'App/Models/Dish';
import DishCart from 'App/Models/DishCart';
import CreateCartValidator from 'App/Validators/CreateCartValidator';

export default class CartsController {
    public async store({ auth, request, response }: HttpContextContract) {
        try {
            const userId = auth.user?.id || 0
            const { quantity, dish_id } = await request.validate(CreateCartValidator)
            const cart = await Cart.findBy('user_id', userId)
            const dish = await Dish.findOrFail(dish_id)
            if (cart) {
                const dishCart = await DishCart.query()
                    .where('dishId', dish.id)
                    .andWhere('cartId', cart.id)
                    .first()
                if (dishCart) {
                    dishCart.quantity = dishCart.quantity + quantity
                    cart.totalPrice = cart.totalPrice + dishCart.price
                    dishCart.price = dishCart.quantity * dish.price
                    await dishCart.save()
                    await cart.save()
                }
                else {
                    const existingDishes = await DishCart.query()
                        .where('cartId', cart.id)
                        .preload('dish')
                    for (let item of existingDishes) {
                        if (item.dish.restaurantId !== dish.restaurantId) {
                            return response.status(400).send({
                                message: 'Add this item will clear your cart. You already have items from another resturent or shop in your cart'
                            })
                        }
                    }
                    let dishCart = new DishCart()
                    dishCart.cartId = cart.id
                    dishCart.dishId = dish.id
                    dishCart.quantity = quantity
                    dishCart.price = dishCart.quantity * dish.price
                    await dishCart.save()
                    cart.totalPrice = cart.totalPrice + dishCart.price
                    await cart.save()
                }
            }
            else {
                let cart = new Cart()
                cart.userId = userId
                let dishCart = new DishCart()
                dishCart.dishId = dish.id
                dishCart.quantity = quantity
                dishCart.price = dishCart.quantity * dish.price
                cart.totalPrice = dishCart.price
                await dishCart.save()
                await cart.save()
                dishCart.cartId = cart.id
                await dishCart.save()
            }
            return response.send(Response({ message: 'Cart Created Successfully' }))
        }
        catch (error) {
            console.log(error)
            return response.status(400).send(error)
        }
    }

    public async show({ auth, request, response }: HttpContextContract) {
        try {
            const { page } = request.qs()
            const userId = auth.user?.id || 0
            const cart = await Cart.query()
                .where('userId', userId)
                .preload('user')
                .firstOrFail()
            const userCartDishes = await DishCart.query()
                .where('cartId', cart.id)
                .preload('dish')
            if (!userCartDishes) {
                return response.status(400).send({
                    message: 'Hungry? You Have Not Added Anything TO Your Cart!'
                })
            }
            else {
                const cartData = userCartDishes.map((item) => {
                    return {
                        id: item.dish.id,
                        name: item.dish.name,
                        image: Application.tmpPath(`upload/${item.dish.image}`),
                        price: item.dish.price,
                        quantity: item.quantity,
                        total_price: item.price
                    }
                })
                if (page === 'cart') {
                    return response.send(Response({
                        cartData: cartData,
                        cartPrice: cart.totalPrice
                    }))
                }
                else if (page == 'order') {
                    const userData = {
                        id: cart.user.id,
                        name: cart.user.name,
                        phone_number: cart.user.phoneNumber,
                        address: cart.user.address
                    }
                    return response.send(Response({
                        cartData: cartData,
                        cartPrice: cart.totalPrice,
                        userData: userData
                    }))
                }
                else {
                    return response.status(400).send({
                        message: 'Invalid: Bad Request: Unknown Query Parameter'
                    })
                }
            }
        } catch (error) {
            console.log(error);
            return response.status(400).send(error)
        }
    }

    public async update({ auth, params, request, response }: HttpContextContract) {
        try {
            const { action } = request.qs()
            const cart = await Cart.findByOrFail('userId', auth.user?.id)
            const dish = await Dish.findOrFail(params.id)
            const cartDish = await DishCart.query()
                .where('cartId', cart.id)
                .andWhere('dishId', dish.id)
                .firstOrFail()
            if (action === 'add') {
                cartDish.quantity = cartDish.quantity + 1
                cartDish.price = cartDish.quantity * dish.price
                await cartDish.save()
                cart.totalPrice = cart.totalPrice + dish.price
                await cart.save()
                return response.send(Response({
                    message: 'Dish Quantity In Cart Incremented By One Successfully'
                }))
            }
            else if (action === 'sub') {
                cartDish.quantity = cartDish.quantity - 1
                cartDish.price = cartDish.quantity * dish.price
                await cartDish.save()
                cart.totalPrice = cart.totalPrice - dish.price
                await cart.save()
                return response.send(Response({
                    message: 'Dish Quantity In Cart Decremented By One Successfully'
                }))
            }
            else {
                return response.status(400).send({
                    message: 'Invalid: Bad Request: Unknown Query Parameter'
                })
            }
        } catch (error) {
            console.log(error);
            return response.status(400).send(error)
        }
    }

    public async destroy({ auth, request, params, response }: HttpContextContract) {
        try {
            const { destroy } = request.qs()
            const cart = await Cart.findByOrFail('userId', auth.user?.id)
            if (destroy === 'one_dish') {
                const cartDish = await DishCart.query()
                    .where('cartId', cart.id)
                    .andWhere('dishId', params.id)
                    .firstOrFail()
                cart.totalPrice = cart.totalPrice - cartDish.price
                await cart.save()
                await cartDish.delete()
                return response.send(Response({
                    message: 'Desired Dish Deleted From User Cart Successfully'
                }))
            }
            else if (destroy === 'all_dishes') {
                await DishCart.query().where('cartId', cart.id).delete()
                cart.totalPrice = 0
                await cart.save()
                return response.send(Response({
                    message: 'All Dishes Deleted From User Cart Successfully'
                }))
            }
            else {
                return response.status(400).send({
                    message: 'Invalid: Bad Request: Unknown Query Parameter'
                })
            }
        } catch (error) {
            console.log(error);
            return response.status(400).send(error)
        }
    }
}
