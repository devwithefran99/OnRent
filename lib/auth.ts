import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI as string);
// Keep this name in sync with OnRent-ServerSIde (it reads the same database).
const db = client.db("OnRent");

// Must have at least 6 characters, one uppercase and one lowercase letter.
const PASSWORD_RULE = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: [
    process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
    "http://localhost:3000",
  ],
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "customer",
        input: true,
        transform: {
          // Only "owner" is accepted from the signup form; anything else
          // becomes "customer". Admin is assigned with scripts/set-role.js.
          input: (value) => (value === "owner" ? "owner" : "customer"),
        },
      },
      phone: {
        type: "string",
        required: false,
        input: true,
      },
      address: {
        type: "string",
        required: false,
        input: true,
      },
    },
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path !== "/sign-up/email") {
        return;
      }

      const body = ctx.body as
        | { password?: string; role?: string }
        | undefined;

      if (body?.role === "admin") {
        throw new APIError("BAD_REQUEST", {
          message: "Admin accounts cannot be created from the signup page.",
        });
      }

      if (!PASSWORD_RULE.test(body?.password ?? "")) {
        throw new APIError("BAD_REQUEST", {
          message:
            "Password must be at least 6 characters and include an uppercase and a lowercase letter.",
        });
      }
    }),
  },
  plugins: [
    jwt({
      jwt: {
        // These claims are readable by the Express server after verification.
        definePayload: ({ user }) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          role: (user as { role?: string }).role ?? "customer",
        }),
      },
    }),
  ],
  database: mongodbAdapter(db, {
    client,
  }),
});

export type UserRole = "customer" | "owner" | "admin";
