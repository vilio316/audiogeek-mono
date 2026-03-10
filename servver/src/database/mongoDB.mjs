import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();
import { setServers } from "node:dns/promises";
setServers(["1.1.1.1", "8.8.8.8"]);

const client = new MongoClient(process.env.MONGODB_STRING);
export const mongo = client.db();
