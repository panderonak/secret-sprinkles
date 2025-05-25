import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnection from "@/lib/dbConnection";
import bcrypt from "bcryptjs";
import UserModel from "@/models/user.models";
import { JWT } from "next-auth";
import { signInSchema } from "@/schemas/signInSchema";

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "janedoe@autopsy.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        const validatedFields = signInSchema.safeParse(credentials);

        if (!validatedFields.success) {
          throw new Error("The credentials don’t look right.");
        }

        await dbConnection();

        try {
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          });

          if (!user) throw new Error("No user found.");

          if (!user.isVerified)
            throw new Error(
              "Please verify your account before you can sign in."
            );

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (isPasswordCorrect) return user;
          else throw new Error("Incorrect password.");
        } catch (error: any) {
          throw new Error(error);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.isAcceptingMessage = user.isAcceptingMessage;
        token.username = user.username;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        const typedToken = token as JWT;
        session.user._id = typedToken._id;
        session.user.isVerified = typedToken.isVerified;
        session.user.isAcceptingMessage = typedToken.isAcceptingMessage;
        session.user.username = typedToken.username;
      }
      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default authOptions;
