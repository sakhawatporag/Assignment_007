import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const client = new MongoClient(process.env.MONGODB_URL as string);
const db = client.db("bazar-dor");

export const auth = betterAuth({
    emailAndPassword: {
      enabled: true,
    },

    

  database: mongodbAdapter(db, {
    client,
  }),
});