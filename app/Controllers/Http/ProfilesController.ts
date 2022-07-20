import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Application from '@ioc:Adonis/Core/Application'

export default class ProfilesController {

    public async index({params, response}: HttpContextContract){
        const username = params.username

        const user = await User.findBy('username', username)

        if(!user){
            response.status(404).json({
                message: "User not Found"
            });
        }
        await user?.preload('posts')
        await user?.preload('followings')
        // const followers = await user.followers()
        return user
    }

    public async edit({params, response}: HttpContextContract){
        const username = params.username

        const user = await User.findBy('username', username)

        if(!user){
            response.status(404).json({
                message: "User not Found"
            });
        }
        return user
    }

    public async update({auth, request, response}: HttpContextContract){
        const user = auth.user
        const avatar = request.file('avatar')

        if(avatar){
            const imageName = new Date().getTime().toString() + `.${avatar.extname}`
            await avatar.move(
                Application.publicPath('images'), {
                    name: imageName
            })
            user!.avatar = `images/${imageName}`
        }      
                
        user!.details = request.only(['details']).details;
        await user!.save()
        return 'Avatar uploaded successfully'

    }

}
