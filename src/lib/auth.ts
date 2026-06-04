import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET ?? "dev-secret-change-in-production",
  trustedOrigins: [process.env.FRONTEND_URL ?? "http://localhost:5173"],
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "CLIENTE",
        input: true,
      },
    },
  },
});

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  emailVerified: boolean;
  image?: string | null;
};
