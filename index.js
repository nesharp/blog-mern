import axios from 'axios'
import express, { json, response } from 'express'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import { registerValidation } from './validations/auth.js'
import { validationResult } from 'express-validator'
import UserModel from './models/User.js'
import bcrypt from 'bcrypt'

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
app.post('/auth/register', registerValidation, async (req, res) => {
	try {
		//getting password from request
		const { password, email, avatarUrl, fullName } = req.body
		//check errors
		const validationErrors = validationResult(req)
		if (!validationErrors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() })
		}
		//hashing password
		const salt = await bcrypt.genSalt(10)
		const hash = await bcrypt.hash(password, salt)
		//creating new user
		const doc = new UserModel({
			email,
			passwordHash: hash,
			avatarUrl,
			fullName
		})
		//saving user to db
		const { _doc: user } = await doc.save()
		const token = jwt.sign({ _id: user._id }, 'secret123', {
			expiresIn: '30d'
		})
		const { passwordHash, __v, ...userData } = user
		res.json({ ...userData, token })
	} catch (error) {
		res.status(500).json({ message: 'Can`t register' })
		console.log(error)
	}
})
//login
app.post('/auth/login', async (req, res) => {
	try {
		const { email, password } = req.body
		const { _doc: user } = await UserModel.findOne({
			email
		})
		if (!user) {
			return res.status(404).json({ message: 'Wrong email or password' })
		}
		const isPassValid = bcrypt.compareSync(password, user.passwordHash)
		if (!isPassValid) {
			return res.status(400).json({ message: 'Wrong email or password' })
		}
		const token = jwt.sign({ _id: user._id }, 'secret123', {
			expiresIn: '30d'
		})
		const { passwordHash, __v, ...userData } = user
		res.json({ ...userData, token })
	} catch (error) {
		res.status(500).json({ message: 'Can`t login' })
		console.log(error)
	}
})
//get user
app.get('/users/me', async (req, res) => {
	try {
		const { token } = req.body
		const { _id } = jwt.verify(token, 'secret123')
		const user = await UserModel.findOne({ _id })
	} catch (error) {
		res.status(500).json({ message: 'Can`t get user' })
		console.log(error)
	}
})
//default express setting
app.listen(4200, error => {
	if (error) {
		return console.log(error)
	}
	console.log('Server is running on port', 4200)
})
