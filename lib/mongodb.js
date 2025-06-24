import mongoose from 'mongoose'

const URI = process.env.MONGODB_URI

if (!URI) {
	throw new Error(
		'Please define the MONGODB_URI environment variable inside .env.local',
	)
}

let cached = global.mongoose

if (!cached) {
	cached = global.mongoose = { conn: null, promise: null }
}

export async function connectToDB() {
	if (cached.conn) {
		return cached.conn
	}
	if (!cached.promise) {
		const opts = {
			bufferCommands: false,
		}
		cached.promise = mongoose.connect(URI, opts).then(mongoose => {
			console.log('Db connected')
			return mongoose
		})
	}
	try {
		cached.conn = await cached.promise
	} catch (e) {
		cached.promise = null
		throw e
	}

	return cached.conn
}