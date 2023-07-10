import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import UserModel from '../models/User.js'

export const Register = async (req, res) => {
	try {
		//getting password from request
		const { password, email, avatarUrl, fullName } = req.body

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
}
export const Login = async (req, res) => {
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
}
export const getMyProfile = async (req, res) => {
	try {
		const { userId } = req
		const { _doc: user } = await UserModel.findById(userId)
		if (!user) {
			return res.status(404).json({ message: 'User not found' })
		}
		const { passwordHash, __v, ...userData } = user
		return res.json(userData)
	} catch (error) {
		res.status(500).json({ message: 'Can`t get user' })
		console.log(error)
	}
}
