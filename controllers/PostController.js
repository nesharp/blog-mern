import PostModel from '../models/Post.js'
export const CreatePost = async (req, res) => {
	try {
		const { title, content, tags, imageUrl } = req.body
		const doc = new PostModel({
			title,
			content,
			tags,
			imageUrl,
			user: req.userId
		})
		const { _doc: post } = await doc.save()
		const { passwordHash, __v, ...postData } = post
		res.json(postData)
	} catch (error) {
		res.status(500).json({ message: 'Can`t create post' })
		console.log(error)
	}
}
export const getPosts = async (req, res) => {
	try {
		const posts = await PostModel.find()
			.populate('user', ['_id', 'avatarUrl', 'fullName', 'email'])
			.sort({ createdAt: -1 })
		const filteredPosts = posts.map(post => {
			const { __v, ...postData } = post._doc
			return postData
		})

		res.json(filteredPosts)
	} catch (error) {
		res.status(500).json({ message: 'Can`t get posts' })
		console.log(error)
	}
}
export const getPost = async (req, res) => {
	try {
		const { id } = req.params
		console.log(id)
		const { _doc: post } = await PostModel.findOneAndUpdate(
			{
				_id: id
			},
			{
				$inc: { viewsCount: 1 }
			},
			{
				returnDocument: 'after'
			}
		).populate('user', ['_id', 'avatarUrl', 'fullName', 'email'])
		const { passwordHash, __v, ...postData } = post

		post && res.json(postData)
	} catch (error) {
		res.status(500).json({ message: 'Can`t get post' })
		console.log(error)
	}
}
export const updatePost = async (req, res) => {
	try {
		const { id: postId } = req.params
		const { userId } = req
		const { title, content, tags, imageUrl } = req.body
		const bPost = await PostModel.findOne({ _id: postId })
		//checking if post exists
		if (!bPost) {
			return res.status(404).json({ message: 'Post not found' })
		}
		if (bPost.user.toString() !== userId) {
			return res.status(403).json({ message: 'You haven`t access' })
		}
		const { _doc: post } = await PostModel.findOneAndUpdate(
			{ _id: postId },
			{
				title,
				content,
				tags,
				imageUrl
			},
			{
				returnDocument: 'after'
			}
		)
		const { passwordHash, __v, ...postData } = post
		res.json(postData)
	} catch (error) {
		res.status(500).json({ message: 'Can`t update post' })
	}
}
export const deletePost = async (req, res) => {
	try {
		const { id: postId } = req.params
		const { userId } = req

		const bPost = await PostModel.findOne({ _id: postId })
		//checking if post exists
		if (!bPost) {
			return res.status(404).json({ message: 'Post not found' })
		}
		const { user, _doc: post } = bPost
		if (user.toString() !== userId) {
			return res.status(403).json({ message: 'You haven`t access' })
		}
		await PostModel.deleteOne({ _id: postId })
		return res.json({ message: `Post "${post.title}" deleted` })
	} catch (error) {
		res.status(500).json({ message: 'Can`t delete post' })
		console.log(error)
	}
}
export const getMyPosts = async (req, res) => {
	try {
		const { userId } = req
		const posts = await PostModel.find({ user: userId }).sort({
			createdAt: -1
		}).populate('user', ['_id', 'avatarUrl', 'fullName', 'email'])
		const filteredPosts = posts.map(post => {
			const { __v, ...postData } = post._doc
			return postData
		})

		return res.json(filteredPosts)
	} catch (error) {
		res.status(500).json({ message: 'Some test error' })
	}
}
