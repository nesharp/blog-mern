import axios from 'axios'
import express, { json, response } from 'express'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import { registerValidation } from './validations/auth.js'
import { validationResult } from 'express-validator'
//db connection
mongoose
	.connect(
		'mongodb+srv://nesterukmisha27:tm9xXS9WU3kwfT2V@cluster0.ldupn0l.mongodb.net/?retryWrites=true&w=majority'
	)
	.then(() => console.log('MongoDB connected'))
	.catch(error => console.log(error))
//app config
const app = express()
app.use(express.json())

app.get('/', (req, res) => {
	res.json({ message: 'Hello World' })
})
app.post('/auth/register', registerValidation, async (req, res) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() })
	}
	const { email, password, fullName, avatarUrl } = req.body
	res.json({ message: `Hello, ${fullName}`, data: { ...req.body } })
})

//default express setting
app.listen(4200, error => {
	if (error) {
		return console.log(error)
	}
	console.log('Server is running on port', 4200)
})
