import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Hash from '@ioc:Adonis/Core/Hash'
import User from 'App/Models/User';
import { Response } from 'App/Utils/ApiUtil';
import UserLoginValidator from 'App/Validators/UserLoginValidator';
import UserSignUpValidator from 'App/Validators/UserSignUpValidator';
import UpdateUserValidator from 'App/Validators/UpdateUserValidator';

export default class UsersController {
    public async signUp({ request, response }: HttpContextContract) {
        try {
            const user = await request.validate(UserSignUpValidator)
            await User.create(user)
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
                return response.send(Response({ message: 'Invalid phone_number or password' }))
            }
            const token = await auth.use('api').generate(user)
            return response.send(Response({ message: 'User LoggedIn Successfully', token: token }))
        } catch (error) {
            console.log(error);
            return response.status(400).send(error)
        }
    }

    public async logout({auth, response}:HttpContextContract){
        try {
            await auth.use('api').revoke()
            return response.send(Response({ message: "User Logout Successfully"}))
        } catch (error) {
            console.log(error);
            return response.status(400).send(error)
        }
    }

    public async show({ auth, response }: HttpContextContract) {
        try {
            const user = await User.find(auth.user?.id)
            return response.send(Response(user))
        } catch (error) {
            console.log(error);
            return response.status(400).send(error)
        }
    }

    public async update({ params, request, response }: HttpContextContract) {
        try {
            const user = await User.findOrFail(params.id)
            const data = await request.validate(UpdateUserValidator)
            await user.merge(data).save()
            return response.send(Response({ message: 'User updated successfully' }))
        } catch (error) {
            console.log(error);
            return response.status(400).send(error)
        }
    }
}
