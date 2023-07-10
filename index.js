import express, { json, response } from 'express'
import mongoose from 'mongoose'
import { registerValidation } from './validations/auth.js'
import checkAuth from './utils/checkAuth.js'
import { Login, Register, getMyProfile } from './controllers/UserController.js'
//db connection
mongoose
	.connect(
		'mongodb+srv://nesterukmisha27:tm9xXS9WU3kwfT2V@cluster0.ldupn0l.mongodb.net/blog?retryWrites=true&w=majority'
	)
	.then(() => console.log('MongoDB connected'))
	.catch(error => console.log(error))
//app config
const app = express()
app.use(express.json())

//---------------------------------------routes---------------------------------------
// register
app.post('/auth/register', registerValidation, Register)
//login
app.post('/auth/login', Login)
//get user
app.get('/users/me', checkAuth, getMyProfile)
//default express setting
app.listen(4200, error => {
	if (error) {
		return console.log(error)
	}
	console.log('Server is running on port', 4200)
})
