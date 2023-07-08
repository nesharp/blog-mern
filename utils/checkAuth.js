import jwt from 'jsonwebtoken'

export default (req, res, next) => {
	const token = (req.headers.authorization || '').split(' ')[1]
	if (!token) {
		return res.status(403).json({ message: 'Auth error' })
	}
	try {
        const { _id } = jwt.verify(token, 'secret123')
        req.userId = _id
	} catch (error) {
		return res.status(403).json({ message: 'Auth error' })
	}
	return next()
}
