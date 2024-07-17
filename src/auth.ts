import UserModel from "@/models/User";
import NextAuth from "next-auth";
import CredentialsProvider  from 'next-auth/providers/credentials';
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnection";



export const {  handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",

      credentials: {
        identifier: { label: "Username/email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect();
        try {
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          });
          if (!user) {
            throw new Error("No user found with this email");
          }
          if (!user.isVerified) {
            throw new Error("User not verified");
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (!isPasswordCorrect) {
            throw new Error("Password incorrect");
          }
          return {id:user._id, role:user.role, isVerified: user.isVerified, username:user.username}
        } catch (error: any) {
          throw new Error(error);
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token) {
        (session.user.id = token.id),
        (session.user.role = token.role),
        (session.user.isVerified = token.isVerified),
        (session.user.username = token.username)
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        (token.id = user.id as string),
        (token.role = user.role),
        (token.isVerified = user.isVerified),
        (token.username = user.username)
      }
      return token;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
});
