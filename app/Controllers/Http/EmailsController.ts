import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import { DateTime } from 'luxon';


export default class EmailsController {

    public async index({response, auth}:HttpContextContract){
        auth.user?.sendVerificationEmail();
        response.status(200).json({
            message: "Email verification sent!"
        });
    }

    public async confirm({response, request, params}:HttpContextContract){
        const user =  await User.findByOrFail('email', params.email)
        if(request.hasValidSignature()){
            user.email_verified_at = DateTime.local()
            user.save()
            response.status(200).json({
                message: "Account verified sucessfully"
            });
        }else{
            response.status(400).json({
                message: "Invalid token"
            });
        }

    }
}
