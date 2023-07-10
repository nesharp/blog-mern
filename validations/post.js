import { body } from 'express-validator'

export const createPostValidation = [
	body('title', 'Incorrect title').isString().isLength({ min: 3, max: 50 }),
	body('content', 'Incorrect content')
		.isString()
		.isLength({ min: 3, max: 500 }),
	body('tags', 'Incorrect tags.').isArray().isLength({ min: 1, max: 10 }),
	body('imageUrl', 'Incorrect image url').isString().isURL().optional()
]
