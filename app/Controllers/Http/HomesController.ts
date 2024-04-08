import { Response } from 'App/Utils/ApiUtil';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Restaurant from 'App/Models/Restaurant';

export default class HomesController {
    public async allRestaurants({ response }: HttpContextContract) {
        try {
            const restaurants = await Restaurant.all()
            const data = restaurants.map((item) => {
                return {
                    id: item.id,
                    name: item.name,
                    opening_time: item.openTime,
                    closing_time: item.closeTime
                }
            })
            return response.send(Response(data))
        } catch (error) {
            console.log(error);
            return response.status(400).send(error)
        }
    }
}
