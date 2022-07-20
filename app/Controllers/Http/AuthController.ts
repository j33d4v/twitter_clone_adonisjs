import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import  { schema, rules } from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User'

export default class AuthController {
    public async signup ({request, response}:HttpContextContract){
        
        try {
            const req = await request.validate({
                schema: schema.create({
                    name: schema.string(),
                    email: schema.string({},[
                        rules.email(),
                        // rules.unique({ table: 'user', column: 'email'})
                    ]),
                    username: schema.string(),
                    password: schema.string({},[
                        rules.confirmed()
                    ])

                }),
                messages: {
                    'name.required': 'Name is required',
                    'email.required': 'Email is required',
                    'password.required': 'Password is required',
                    'username.required': 'Username is required',
                }

                
            })

            const user = new User();
            user.name = req.name
            user.email = req.email
            user.username = req.username
            user.password = req.password
            
            await user.save();

            user?.sendVerificationEmail();

            return 'Account created succesfully'

    
         } catch(error){

            return error;
        }
        
      
    }

    public async login ({request, auth, response}:HttpContextContract){
        if(auth.isAuthenticated){
            return 'User is already logged in'
        }

        try {
            const req = await request.validate({
                schema: schema.create({
                    email: schema.string({},[
                        rules.email(),
                        // rules.unique({ table: 'user', column: 'email'})
                    ]),
                    password: schema.string({},[
                        rules.minLength(5)
                    ])

                }),
                messages: {
                    'email.required': 'Email is required',
                    'password.required': 'Password is required',
                    'password.minLength': 'Password must be at least 8 characters',
                }
            })

            const email = req.email;
            const password = req.password;

            await auth.attempt(email,password)

            return 'Success'

         } catch(error) {

            return error;
        }
        
      
    }

    public async logout ({auth} : HttpContextContract){
        
        if(!auth.isAuthenticated){
            return 'User not authenticated'
        }

        await auth.logout()
        
        return 'Logged out'
    }
}
