import Application from '@ioc:Adonis/Core/Application';
import { Response, toBoolean } from 'App/Utils/ApiUtil';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Dish from 'App/Models/Dish';
import fs from 'fs/promises'
import CreateDishValidator from 'App/Validators/CreateDishValidator';

export default class DishesController {
    public async store({ auth, request, response }: HttpContextContract) {
        try {
            const data = await request.validate(CreateDishValidator)
            await data.image.move(Application.tmpPath('uploads'), {
                name: `${Date.now()}-${data.image.clientName}`
            })
            await Dish.create({
                restaurantId: auth.user?.id,
                name: data.name,
                description: data.description,
                price: data.price,
                image: data.image.fileName
            })
            return response.send(Response({ message: 'Dish Created Successfully' }))
        } catch (error) {
            console.log(error);
            return response.status(400).send(error)
        }
    }

    public async show({ auth, request, response }: HttpContextContract) {
        try {
            const restaurantId = auth.user?.id || 0
            const { menu } = request.qs()
            let dishes
            if (menu === 'deal') {
                dishes = await Dish.query().where('restaurantId', restaurantId)
                    .andWhere('name', 'Like', "deal%")
            }
            else if (menu === 'regular') {
                dishes = await Dish.query().where('restaurantId', restaurantId)
                    .andWhere('name', 'Not Like', "deal%")
            }
            else {
                return response.status(400).send({
                    message: 'Invalid: Bad Request: Unknown Query Parameter'
                })
            }
            const data = dishes.map((dish) => {
                return {
                    id: dish.id,
                    name: dish.name,
                    description: dish.description,
                    price: dish.price,
                    image: Application.tmpPath(`uploads/${dish.image}`)
                }
            })
            return response.send(Response(data))
        } catch (error) {
            console.log(error);
            return response.status(400).send(error)
        }
    }

    public async update({ params, request, response }: HttpContextContract) {
        try {
            const { status } = request.qs()
            const dish = await Dish.findOrFail(params.id)
            if (status === 'true' || status === 'false') {
                const value = toBoolean(status)
                dish.status = value
                await dish.save()
                return response.send(Response({ message: 'Dish Status Updated Successfully' }))
            }
            else if (status === 'null') {
                const data = await request.validate(CreateDishValidator)
                await data.image.move(Application.tmpPath('uploads'), {
                    name: `${Date.now()}-${data.image.clientName}`
                })
                const previousImage = Application.tmpPath(`uploads/${dish.image}`)
                await fs.unlink(previousImage)
                await dish.merge({
                    name: data.name,
                    description: data.description,
                    price: data.price,
                    image: data.image.fileName
                }).save()
                return response.send(Response({ message: 'Dish Updated Successfully' }))
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

    public async destroy({ params, response }: HttpContextContract) {
        try {
            const dish = await Dish.findOrFail(params.id)
            const image = Application.tmpPath(`uploads/${dish.image}`)
            await fs.unlink(image)
            await dish.delete()
            return response.send(Response({ message: 'Dish Deleted Successfully' }))
        } catch (error) {
            console.log(error);
            return response.status(400).send(error)
        }
    }
}
