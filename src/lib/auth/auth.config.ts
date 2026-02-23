import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db/mongoose";
import { User } from "@/models";
import { loginSchema } from "@/lib/validations/auth";
import { verifyBackupCode, verifyTotp } from "@/lib/auth/totp";

export const authConfig: NextAuthConfig = {
  providers: [
    Google,
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        await connectDB();
        const user = await User.findOne({ email: parsed.data.email }).select(
          "+password +twoFactorSecret +twoFactorEnabled +twoFactorBackupCodes isBanned"
        );
        if (!user || !user.password) return null;

        const valid = await bcrypt.compare(parsed.data.password, user.password);
        if (!valid) return null;

        if (!user.isEmailVerified) return null;
        if (user.isBanned) return null;

        if (user.twoFactorEnabled) {
          const totpCode = parsed.data.totpCode;
          const isBackupCode =
            parsed.data.isBackupCode === true || parsed.data.isBackupCode === "true";

          if (!totpCode) {
            throw new Error("TWO_FACTOR_REQUIRED");
          }

          if (isBackupCode) {
            const codes = user.twoFactorBackupCodes ?? [];
            const matchIndex = codes.findIndex(
              (entry) => !entry.usedAt && verifyBackupCode(totpCode, entry.code)
            );
            if (matchIndex === -1) {
              throw new Error("INVALID_TWO_FACTOR_CODE");
            }
            codes[matchIndex].usedAt = new Date();
            user.twoFactorBackupCodes = codes;
            await user.save();
          } else {
            const isValid = verifyTotp(totpCode, user.twoFactorSecret ?? "");
            if (!isValid) {
              throw new Error("INVALID_TWO_FACTOR_CODE");
            }
          }
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          image: user.avatar,
          role: user.role,
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
    verifyRequest: "/auth/verify-email",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email) {
        await connectDB();
        const existing = await User.findOne({ email: user.email })
          .select("_id isBanned")
          .lean();
        if (existing) {
          if (existing.isBanned) return false;
        } else {
          await User.create({
            name: user.name ?? user.email,
            email: user.email,
            avatar: user.image ?? undefined,
            isEmailVerified: true,
            provider: "google",
            role: "customer",
          });
        }
      }
      return true;
    },
    async jwt({ token, user, account, trigger }) {
      // On initial sign-in, resolve the MongoDB _id and role
      if (user) {
        if (account?.provider === "credentials") {
          // Credentials authorize already returns the MongoDB _id
          token.id = user.id;
          token.role = user.role ?? "customer";
        } else {
          // OAuth providers return a provider-specific ID, so look up the MongoDB user
          await connectDB();
          const dbUser = await User.findOne({ email: user.email })
            .select("_id role isBanned")
            .lean();
          if (dbUser) {
            token.id = dbUser._id.toString();
            token.role = dbUser.role;
            token.isBanned = dbUser.isBanned ?? false;
          }
        }
      }
      // Refresh from DB when session is explicitly updated (e.g. role change)
      if (trigger === "update" && token.id) {
        await connectDB();
        const dbUser = await User.findById(token.id).select("role isBanned").lean();
        if (dbUser) {
          token.role = dbUser.role;
          token.isBanned = dbUser.isBanned ?? false;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role ?? "customer";
      }
      return session;
    },
  },
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,
};
