import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { admin, jwt } from "better-auth/plugins";

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI is not set");

// একই client সব request-এ ব্যবহার হবে। কেউ এটা close করবে না।
const globalForMongo = globalThis as unknown as { _mongoClient?: MongoClient };

const client =
  globalForMongo._mongoClient ??
  new MongoClient(uri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 10000,
  });

// production-এও cache রাখুন, শুধু dev-এ নয়।
globalForMongo._mongoClient = client;

const db = client.db("Pizza_hub");

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },
  user: {
    deleteUser: {
      enabled: true,
    },
    additionalFields: {
      accountType: {
        type: "string",
        required: false,
        defaultValue: "customer",
        input: true,
      },
      premium: {
        type: "boolean",
        defaultValue: false,
        input: false,
      },
    },
    changeEmail: {
      enabled: true,
      updateEmailWithoutVerification: true,
    },
  },

  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const accountType = (user as { accountType?: string }).accountType;

          return {
            data: {
              ...user,
              role: accountType === "vendor" ? "vendor" : "customer",
            },
          };
        },
      },
    },
  },

  database: mongodbAdapter(db, {
    client,
  }),

  plugins: [
    jwt(),
    admin({
      defaultRole: "customer",
      adminRoles: ["admin"],
    }),
  ],
});