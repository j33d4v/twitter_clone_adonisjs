import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Application from '@ioc:Adonis/Core/Application'
import Post from 'App/Models/Post'
import  { schema, rules } from '@ioc:Adonis/Core/Validator'


export default class PostsController {
  public async index({}: HttpContextContract) {}

  public async create({}: HttpContextContract) {}

  public async store({request, auth, response}: HttpContextContract) {
    try {

    const req = await request.validate({
      schema: schema.create({
          text: schema.string({}),
          file: schema.file({
              size: '10mb',
              extnames : ['jpg', 'png', 'jpeg', 'mp4', 'svg'],
          })
      }),
        messages: {
            'text.required': 'Text is required',
            'file.required': 'file is required',
        },  
    })

    const post = new Post
    post.text = req.text
    post.userId = auth.user.id

    const imageName = new Date().getTime().toString() + `.${req.file.extname}`
    await req.file.move(
            Application.publicPath('images'), {
                name: imageName
    })
    post.file = `images/${imageName}`
    post.save()
    response.status(200).json({
      message: "Post successfully createtd"
    });
  }catch(error){

    return error;
}
    
  }

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
