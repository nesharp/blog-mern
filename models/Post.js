import { Schema, model } from 'mongoose'

const postSchema = new Schema(
	{
		title: {
			type: String,
			required: true
		},
		content: {
			type: String,
			required: true
		},
		tags: {
			type: [String],
			required: true
		},
		imageUrl: {
			type: String,
			required: false
		},
		viewsCount: {
			type: Number,
			default: 0
		},
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true
		}
	},
	{
		timestamps: true
	}
)
export default model('Post', postSchema)
