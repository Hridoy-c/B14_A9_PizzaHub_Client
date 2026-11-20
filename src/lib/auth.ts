import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { admin, jwt } from "better-auth/plugins";

const client = new MongoClient(process.env.MONGODB_URI || "");
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
    // Matches the form's "Minimum 6 characters" rule.
    minPasswordLength: 6,
  },
  user: {
    deleteUser: {
      enabled: true,
    },
    additionalFields: {
      // Sent by the sign-up form; the hook below turns it into `role`.
      accountType: {
        type: "string",
        required: false,
        defaultValue: "customer",
        input: true,
      },
    },
    changeEmail: {
      enabled: true,
      // Email/password accounts are unverified, so let them switch address
      // without an SMTP provider. Verified social accounts still need one.
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
              // Only customer or vendor can be self-selected. Never admin.
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