import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const client = new MongoClient(process.env.MONGODB_URI || "");
const db = client.db("Pizza_hub");

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    // Matches the form's "Minimum 6 characters" rule.
    minPasswordLength: 6,
  },
  user: {
    additionalFields: {
      // Customer / vendor / admin, chosen on the sign-up form.
      role: {
        type: "string",
        required: false,
        defaultValue: "customer",
        input: true,
      },
    },
  },
  database: mongodbAdapter(db, {
    client,
  }),
});
