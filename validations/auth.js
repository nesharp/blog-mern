import { body } from 'express-validator'

export const registerValidation = [
	body('email', 'Incorrect email').isEmail(),
	body(
		'password',
		'Password must be longer than 6 and shorter than 16 characters'
	).isLength({ min: 6, max: 16 }),
	body('fullName', 'Incorrect full name')
		.isString()
		.isLength({ min: 3, max: 20 }),
	body('avatarUrl', 'Incorrect avatar url').isString().optional().isURL()
]
