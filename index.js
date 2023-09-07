import express from 'express'
import multer from 'multer'
import mongoose from 'mongoose'
import { checkAuth, handleErrors } from './utils/index.js'
import { UserController, PostController } from './controllers/index.js'
import {
	loginValidation,
	registerValidation,
	createPostValidation
} from './validations/index.js'
//db connection
mongoose
	.connect(
		'mongodb+srv://nesterukmisha27:tm9xXS9WU3kwfT2V@cluster0.ldupn0l.mongodb.net/blog?retryWrites=true&w=majority'
	)
	.then(() => console.log('MongoDB connected'))
	.catch(error => console.log(error))

//app config
const app = express()
const storage = multer.diskStorage({
	destination: (_, __, cb) => {
		cb(null, 'uploads')
	},
	filename: (_, file, cb) => {
		cb(null, file.originalname)
	}
})
const upload = multer({ storage })

app.use(express.json())
app.use('/uploads', express.static('uploads'))
//---------------------------------------routes---------------------------------------
// register
app.post(
	'/auth/register',
	registerValidation,
	handleErrors,
	UserController.Register
)
//login
app.post('/auth/login', loginValidation, handleErrors, UserController.Login)
//get user
app.get('/users/me', checkAuth, UserController.getMyProfile)
//create post
app.post(
	'/posts',
	checkAuth,
	createPostValidation,
	handleErrors,
	PostController.CreatePost
)
//get posts
app.get('/posts', PostController.getPosts)
//get post by id
app.get('/posts/:id', PostController.getPost)
//update post
app.patch(
	'/posts/:id',
	checkAuth,
	createPostValidation,
	handleErrors,
	PostController.updatePost
)
//delete post
app.delete('/posts/:id', checkAuth, PostController.deletePost)
//upload image
app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
	res.json({ imageUrl: `/uploads/${req.file.originalname}` })
})
//default express setting
app.listen(4200, error => {
	if (error) {
		return console.log(error)
	}
	console.log('Server is running on port', process.env.PORT || 4200)
})
