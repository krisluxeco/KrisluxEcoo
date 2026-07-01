import { connect } from "mongoose";

const mongodbURL = process.env.MONGODB_URL;

if (!mongodbURL) {
  throw new Error("MONGODB_URL is not defined in environment variables");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDb = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = connect(mongodbURL, {
      bufferCommands: false,
    }).then((conn) => conn.connection);
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null; // reset so the next call can retry instead of reusing a dead promise
    throw error; // let the route's catch block report the real error
  }

  return cached.conn;
};

export default connectDb;
