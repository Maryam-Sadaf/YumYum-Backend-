import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Hash from '@ioc:Adonis/Core/Hash'
import User from 'App/Models/User';
import { Response } from 'App/Utils/ApiUtil';
import UserLoginValidator from 'App/Validators/Users/UserLoginValidator';
import UserSignUpValidator from 'App/Validators/Users/UserSignUpValidator';
import UpdateUserValidator from 'App/Validators/Users/UserUpdateValidator';

export default class UsersController {
    public async signUp({ auth, request, response }: HttpContextContract) {
        try {
            const data = await request.validate(UserSignUpValidator)
            const user = await User.create(data)
            const token = await auth.use('user_api').generate(user)
            return response.send(Response({ message: 'User SignUp Successfully', token: token }))
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
                return response.status(400).send({ message: 'Invalid phone_number or password' })
            }
            const token = await auth.use('user_api').generate(user)
            return response.send(Response({ message: 'User LoggedIn Successfully', token: token }))
        } catch (error) {
            console.log(error);
            return response.status(400).send(error)
        }
    }

    public async logout({auth, response}:HttpContextContract){
        try {
            await auth.use('user_api').revoke()
            return response.send(Response({ message: "User LogOut Successfully"}))
        } catch (error) {
            console.log(error);
            return response.status(400).send(error)
        }
    }

    public async show({ auth, response }: HttpContextContract) {
        try {
            const user = await User.findOrFail(auth.user?.id)
            const { created_at, updated_at, ...data} = user.toJSON()
            return response.send(Response(data))
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
