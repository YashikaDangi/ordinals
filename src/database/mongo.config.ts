//@ts-nocheck
import mongoose, { Mongoose } from "mongoose";
const MONGO_URI = process.env.MONGODB_URI;
console.log(MONGO_URI, "URI");
if (!MONGO_URI) {
  throw new Error(
    "Please define the MONGO_URI environment variable inside .env.local"
  );
}
type CachedMongoose = {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
};
declare global {
  namespace NodeJS {
    interface Global {
      mongoose: CachedMongoose;
    }
  }
}
let cached = globalThis.mongoose;
if (!cached) {
  cached = globalThis.mongoose = { conn: null, promise: null };
}
async function connect(): Promise<Mongoose> {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    cached.promise = mongoose.connect(MONGO_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  if (cached.conn) console.log("connected to DB");
  else {
    console.log("didnt connect");
  }
  return cached.conn;
}
export default connect;
