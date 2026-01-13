import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error("Invalid/Missing environment variable: MONGODB_URI");
}

const uri = process.env.MONGODB_URI;

declare global {
  var mongoClient: MongoClient | undefined;
}

let client: MongoClient;

if (process.env.NODE_ENV === "production") {
  client = new MongoClient(uri);
} else {
  if (!global.mongoClient) {
    global.mongoClient = new MongoClient(uri);
  }
  client = global.mongoClient;
}

export default client;
