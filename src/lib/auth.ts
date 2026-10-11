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

const vercelOrigin = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : undefined;
const appOrigin =
    process.env.NEXT_PUBLIC_APP_URL ||
    vercelOrigin ||
    process.env.BETTER_AUTH_URL ||
    "http://localhost:3000";
const staticTrustedOrigins = [
    appOrigin,
    process.env.BETTER_AUTH_URL,
    process.env.VERCEL_BRANCH_URL
      ? `https://${process.env.VERCEL_BRANCH_URL}`
      : undefined,
    "http://localhost:3000",
    "http://127.0.0.1:3000",
].filter((origin): origin is string => Boolean(origin));
const trustedOrigins = async (request?: Request) => {
  const requestOrigin = request?.headers.get("origin");
  const requestUrlOrigin = request ? new URL(request.url).origin : undefined;
  return [
    ...staticTrustedOrigins,
    requestOrigin,
    requestUrlOrigin,
  ].filter((origin): origin is string => Boolean(origin));
};
const allowedHosts = [
  "localhost:3000",
  "127.0.0.1:3000",
  "*.vercel.app",
  ...([process.env.VERCEL_URL, process.env.VERCEL_BRANCH_URL]
    .filter((host): host is string => Boolean(host))),
  ...(process.env.NEXT_PUBLIC_APP_URL
    ? [new URL(process.env.NEXT_PUBLIC_APP_URL).host]
    : []),
];

export const auth = betterAuth({
    secret:
      process.env.BETTER_AUTH_SECRET ||
      randomUUID(),
    baseURL: {
      allowedHosts,
      fallback: appOrigin,
      protocol: appOrigin.startsWith("https://") ? "https" : "http",
    },
    trustedOrigins,
  emailAndPassword: {
    enabled: true,
  },
  socialProviders,
  database,
});