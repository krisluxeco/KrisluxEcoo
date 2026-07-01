import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import User from "./models/user.model";
import bcrypt from "bcryptjs";
import Google from "next-auth/providers/google";
import connectDb from "./lib/db";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL?.toLowerCase();

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {
          label: "email",
          type: "email",
          placeholder: "johndoe@gmail.com",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "******",
        },
      },
      async authorize(credentials, request) {
        await connectDb();
        const email = credentials.email.toLowerCase();
        const password = credentials.password;
        const user = await User.findOne({ email });

        if (!user) {
          throw new Error("User does not exist");
        }

        if (user.isBlocked) {
          throw new Error("Your account has been suspended.");
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
          throw new Error("Incorrect Password");
        }

        // fixed admin email always gets admin role
        const role = email === ADMIN_EMAIL ? "admin" : user.role;

        if (role === "admin" && user.role !== "admin") {
          user.role = "admin";
        }
        
        user.lastLogin = new Date();
        await user.save();

        return {
          id: user._id.toString(),
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          role,
        };
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider == "google") {
        try {
          await connectDb();

          const email = user.email?.toLowerCase();
          let dbUser = await User.findOne({ email });

          if (!dbUser) {
            const names = user.name?.split(" ") || [];
            dbUser = await User.create({
              firstName: names[0] || "",
              lastName: names.slice(1).join(" ") || "",
              email,
              image: user.image,
              role: email === ADMIN_EMAIL ? "admin" : "user",
            });
          } else {
            if (dbUser.isBlocked) {
              console.error("Blocked user attempted to login via Google:", email);
              return false; // Reject sign in
            }
            if (email === ADMIN_EMAIL && dbUser.role !== "admin") {
              dbUser.role = "admin";
            }
          }
          
          dbUser.lastLogin = new Date();
          await dbUser.save();

          user.id = dbUser._id.toString();
          user.role = dbUser.role;
        } catch (error) {
          console.error("Google sign-in error:", error);
          return false;
        }
      }
      return true;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
        token.image = user.image;
      }

      if (trigger === "update" && session) {
        if (session.name) token.name = session.name;
        if (session.role) token.role = session.role;
        if (session.image) token.image = session.image;
      }

      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.role = token.role;
        session.user.image = token.image;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 10 * 24 * 60 * 60, // 10 days, in seconds
  },
  secret: process.env.AUTH_SECRET,
});
