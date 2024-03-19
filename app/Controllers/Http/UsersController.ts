import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User';
import { Response } from 'App/Utils/ApiUtil';
import UserLoginValidator from 'App/Validators/UserLoginValidator';
import UserSignUpValidator from 'App/Validators/UserSignUpValidator';

export default class UsersController {
    public async signUp({ request, response }: HttpContextContract) {
        try {
            const { name, phone_number, password } = await request.validate(UserSignUpValidator)
            const user = new User()
            user.name = name
            user.phoneNumber = phone_number
            user.password = password
            await user.save()
            return response.send(Response({ message: 'User SignUp Successfully' }))
        } catch (error) {
            console.log(error);
            return response.status(400).send(error)
        }
    }

    public async login({ request, response, auth }: HttpContextContract){
        try {
            const {phone_number, password} = await request.validate(UserLoginValidator)
            const token = await auth.use('api').attempt(phone_number, password)
            return response.send(Response({ message: 'Logged In', token: token}))
        } catch (error) {
            console.log(error);
            return response.status(400).send(error)
        }
    }
}
