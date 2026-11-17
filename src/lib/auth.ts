import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { Pizza } from "lucide-react";

const client = new MongoClient(process.env.MONGODB_URI || "");
const db = client.db("Pizza_hub");

export const auth = betterAuth({
    emailAndPassword: { 
    enabled: true, 
  },
  database: mongodbAdapter(db, {
    client,
  }),
  
});