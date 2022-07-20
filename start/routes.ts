
import Route from '@ioc:Adonis/Core/Route'


Route.on('/').render('welcome')
Route.on('/signup').render('auth/signup')

Route.post('/signup','AuthController.signup');
Route.post('/login','AuthController.login');
Route.post('/logout','AuthController.logout');

Route.post('/verify-email','EmailsController.index').middleware('auth');
Route.get('/verify-email/:email','EmailsController.confirm').as('verifyEmail')

Route.get('/account/edit', 'ProfilesController.edit').middleware('auth')
Route.post('/account/edit', 'ProfilesController.update').middleware('auth')
Route.get('/:username', 'ProfilesController.index').middleware('auth')

Route.get('/posts/create', 'PostsController.create').middleware('auth')
Route.post('/posts/create', 'PostsController.store').middleware('auth')

Route.post('/follow/:userid', 'FollowsController.store').middleware('auth')
Route.delete('/follow/:userid', 'FollowsController.destroy').middleware('auth')


Route.get('/timelines/index', 'TimelinesController.index').middleware('auth')
