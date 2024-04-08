import Application from '@ioc:Adonis/Core/Application';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Dish from 'App/Models/Dish';
import Order from 'App/Models/Order';
import OrderDetail from 'App/Models/OrderDetail';
import { generateOrderNumber, Response } from 'App/Utils/ApiUtil';

export default class OrdersController {
    public async store({ auth, request, response }: HttpContextContract) {
        try {
            const userId = auth.user?.id || 0
            const { quantity, dish_id } = request.only(['quantity', 'dish_id'])
            var total_price = 0, restaurant_id = 0
            const data = Array()
            const order = new Order()
            order.userId = userId
            await order.save()
            for (let i = 0; i < quantity.length; i++) {
                const dish = await Dish.findOrFail(dish_id[i])
                data.push({
                    order_id: order.id,
                    dish_id: dish_id[i],
                    quantity: quantity[i],
                    price: quantity[i] * dish.price
                });
                total_price += quantity[i] * dish.price
                restaurant_id = dish.restaurantId
            }
            order.restaurantId = restaurant_id
            order.orderNumber = generateOrderNumber(order.id)
            order.totalPrice = total_price
            await order.save()
            await OrderDetail.createMany(data);
            return response.send(Response({
                message: 'Order placed successfully. Send notification to the restaurant'
            }))
        } catch (error) {
            console.log(error);
            return response.status(400).send(error)
        }
    }
    public async show({ auth, request, response }: HttpContextContract) {
        try {
            const { page } = request.qs()
            const restaurantId = auth.user?.id || 0
            let orders = Array()
            if (page === 'notification') {
                orders = await Order.query()
                    .where('restaurantId', restaurantId)
                    .andWhere('status', false)
                    .preload('order_details', (orderDetailQuery) => {
                        orderDetailQuery.preload('dish')
                    })
                    .preload('restaurant')
                    .preload('user')
            }
            else if (page === 'order') {
                orders = await Order.query()
                    .where('restaurantId', restaurantId)
                    .andWhere('status', true)
                    .preload('order_details', (orderDetailQuery) => {
                        orderDetailQuery.preload('dish')
                    })
                    .preload('restaurant')
                    .preload('user')
            }
            else {
                return response.status(400).send({
                    message: 'Invalid: Bad Request: Unknown Query Parameter'
                })
            }
            const data = orders.map((order) => {
                return {
                    id: order.id,
                    order_number: order.orderNumber,
                    total_bill: order.totalPrice,
                    customer_name: order.user.name,
                    customer_phone_number: order.user.phoneNumber,
                    customer_address: order.user.address,
                    order_details: order.order_details.map((item) => {
                        return {
                            dish_name: item.dish.name,
                            dish_image: Application.tmpPath(`uploads/${item.dish.image}`),
                            dish_price: item.dish.price,
                            dish_quantity: item.quantity,
                            total_price: item.price
                        }
                    })
                }
            })
            return response.send(Response(data))
        } catch (error) {
            console.log(error);
            return response.status(400).send(error)
        }
    }
    public async update({ params, response }: HttpContextContract) {
        try {
            const order = await Order.findOrFail(params.id)
            order.status = true
            await order.save()
            return response.send(Response({
                messgae: "Order status Updated To Complete Successfully"
            }))
        } catch (error) {
            console.log(error);
            return response.status(400).send(error)
        }
    }
}
