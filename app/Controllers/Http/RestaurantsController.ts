import { Response } from 'App/Utils/ApiUtil';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Restaurant from 'App/Models/Restaurant';
import RestaurantSignUpValidator from 'App/Validators/RestaurantSignUpValidator';
import RestaurantLoginValidator from 'App/Validators/RestaurantLoginValidator';
import RestaurantUpdateValidator from 'App/Validators/RestaurantUpdateValidator';

export default class RestaurantsController {
    public async signUp({ auth, request, response }: HttpContextContract) {
        try {
            const data = await request.validate(RestaurantSignUpValidator)
            const restaurant = await Restaurant.findByOrFail('license_key', data.license_key)
            if (restaurant.name !== null) {
                return response.status(400).send({ message: 'Already Exists Enter Valid License Key' })
            }
            const restaurantData = await restaurant.merge(data).save()
            const token = await auth.use('restaurant_api').generate(restaurantData)
            return response.send(Response({ message: 'Restaurant SignUp Successfully', token: token }))
        } catch (error) {
            console.log(error);
            return response.status(400).send(error)
        }
    }

    public async login({ auth, request, response }: HttpContextContract) {
        try {
            const { name, license_key } = await request.validate(RestaurantLoginValidator)
            const restaurant = await Restaurant.findByOrFail('name', name)
            if (restaurant?.licenseKey !== license_key) {

                return response.status(400).send({ message: 'Invalid License Key' })
            }
            const token = await auth.use('restaurant_api').generate(restaurant)
            return response.send(Response({ message: 'Restaurant LoggenIn Successfullly', token: token }))
        } catch (error) {
            console.log(error);
            return response.status(400).send(error)
        }
    }

    public async logout({ auth, response }: HttpContextContract) {
        try {
            await auth.use('restaurant_api').revoke()
            return response.send(Response({ message: 'Restaurant LogOut Successfully' }))
        } catch (error) {
            console.log(error);
            return response.status(400).send(error)
        }
    }

    public async show({ auth, response }: HttpContextContract) {
        try {
            const restaurant = await Restaurant.findOrFail(auth.user?.id)
            const { created_at, updated_at, ...data } = restaurant.toJSON()
            return response.send(Response(data))
        } catch (error) {
            console.log(error);
            return response.status(error).send(error)
        }
    }

    public async update({ params, request, response }: HttpContextContract) {
        try {
            const restaurant = await Restaurant.findOrFail(params.id)
            const data = await request.validate(RestaurantUpdateValidator)
            await restaurant.merge(data).save()
            return response.send(Response({ message: 'Restaurant updated successfully' }))
        } catch (error) {
            console.log(error);
            return response.status(400).send(error)
        }
    }
}
