import { betterAuth } from "better-auth";
import { randomUUID } from "node:crypto";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { memoryAdapter } from "@better-auth/memory-adapter";

const mongoUrl = process.env.MONGODB_URL;
const validMongoUrl =
  mongoUrl &&
  (mongoUrl.startsWith("mongodb://") || mongoUrl.startsWith("mongodb+srv://")) &&
  !mongoUrl.includes("YOUR_") &&
  !mongoUrl.includes("******")
    ? mongoUrl
    : null;
const client = validMongoUrl ? new MongoClient(validMongoUrl) : null;
const db = client?.db("bazar-dor");

const database = client && db
  ? mongodbAdapter(db, { client })
  : memoryAdapter({
      user: [],
      session: [],
      account: [],
      verification: [],
    });

const googleClientId = process.env.GOOGLE_CLIENT_ID || process.env.GOOGLE_ID;
const googleClientSecret =
  process.env.GOOGLE_CLIENT_SECRET || process.env.GOOGLE_SECRET;
const socialProviders = {
  ...(googleClientId && googleClientSecret
    ? {
        google: {
          clientId: googleClientId,
          clientSecret: googleClientSecret,
        },
      }
    : {}),
  ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
    ? {
        github: {
          clientId: process.env.GITHUB_CLIENT_ID,
          clientSecret: process.env.GITHUB_CLIENT_SECRET,
        },
      }
    : {}),
};

export const auth = betterAuth({
  secret:
    process.env.BETTER_AUTH_SECRET ||
    randomUUID(),
  baseURL: process.env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
  },
  socialProviders,
  database,
});