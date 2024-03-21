import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Hash from '@ioc:Adonis/Core/Hash'
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

    public async login({ request, response, auth }: HttpContextContract) {
        try {
            const { phone_number, password } = await request.validate(UserLoginValidator)
            const user = await User.findByOrFail('phone_number', phone_number)
            if (!(await Hash.verify(user.password, password))) {
                return response.send(Response({ message: 'Invalid phone_number or password'}))
            }
            const token = await auth.use('api').generate(user)
            return response.send(Response({ message: 'Logged In', token: token }))
        } catch (error) {
            console.log(error);
            return response.status(400).send(error)
        }
    }

    public async show({auth, response}: HttpContextContract){
        try {
            const user = await User.find(auth.user?.id)
            return response.send(Response(user))
        } catch (error) {
            console.log(error);
            return response.status(400).send(error)
        }
    }
}
