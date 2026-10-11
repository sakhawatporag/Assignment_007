import { betterAuth } from "better-auth";
import { randomUUID } from "node:crypto";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { memoryAdapter } from "@better-auth/memory-adapter";

function environmentValue(value: string | undefined) {
  const trimmed = value?.trim();
  if (!trimmed) return undefined;
  return trimmed.replace(/^['"]|['"]$/g, "");
}

const mongoUrl =
  environmentValue(process.env.MONGODB_URL) ||
  environmentValue(process.env.MONGODB_URI);
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

const googleClientId =
  environmentValue(process.env.GOOGLE_CLIENT_ID) ||
  environmentValue(process.env.GOOGLE_ID);
const googleClientSecret =
  environmentValue(process.env.GOOGLE_CLIENT_SECRET) ||
  environmentValue(process.env.GOOGLE_SECRET);
const socialProviders = {
  ...(googleClientId && googleClientSecret
    ? {
        google: {
          clientId: googleClientId,
          clientSecret: googleClientSecret,
        },
      }
    : {}),
  ...(environmentValue(process.env.GITHUB_CLIENT_ID) &&
  environmentValue(process.env.GITHUB_CLIENT_SECRET)
    ? {
        github: {
          clientId: environmentValue(process.env.GITHUB_CLIENT_ID)!,
          clientSecret: environmentValue(process.env.GITHUB_CLIENT_SECRET)!,
        },
      }
    : {}),
};

function normalizeOrigin(value: string | undefined) {
    if (!value) return undefined;

    try {
      const candidate = value.startsWith("http://") || value.startsWith("https://")
        ? value
        : `https://${value}`;
      return new URL(candidate).origin;
    } catch {
      console.error("Ignoring invalid auth URL environment variable:", value);
      return undefined;
    }
}

const vercelOrigin = normalizeOrigin(
    process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL,
);
const appOrigin =
      normalizeOrigin(process.env.NEXT_PUBLIC_APP_URL) ||
      vercelOrigin ||
      normalizeOrigin(process.env.BETTER_AUTH_URL) ||
      "http://localhost:3000";
const staticTrustedOrigins = [
      appOrigin,
      normalizeOrigin(process.env.BETTER_AUTH_URL),
      normalizeOrigin(process.env.VERCEL_BRANCH_URL),
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
  ...(normalizeOrigin(process.env.NEXT_PUBLIC_APP_URL)
    ? [new URL(normalizeOrigin(process.env.NEXT_PUBLIC_APP_URL)!).host]
    : []),
  ...(normalizeOrigin(process.env.BETTER_AUTH_URL)
    ? [new URL(normalizeOrigin(process.env.BETTER_AUTH_URL)!).host]
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