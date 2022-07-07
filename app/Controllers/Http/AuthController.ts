import Mail from '@ioc:Adonis/Addons/Mail'
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
                    password: schema.string({},[
                        rules.confirmed()
                    ])

                }),
                messages: {
                    'name.required': 'Name is required',
                    'email.required': 'Email is required',
                    'password.required': 'Password is required',
                }

                
            })

            const user = new User();
            user.name = req.name
            user.email = req.email
            user.password = req.password
            
            await user.save();

            await Mail.send((message) => {
                message
                  .from('mj@twitterclone.com')
                  .to(user.email)
                  .subject('Please verify your email')
                  .htmlView('emails/welcome', { user })
              })

            return response.redirect('/')

    
         } catch(error){

            return error;
        }
        
      
    }

    public async login ({request, auth, response}:HttpContextContract){
        
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
        
        await auth.logout()
        
        return 'Logged out'
    }
}
