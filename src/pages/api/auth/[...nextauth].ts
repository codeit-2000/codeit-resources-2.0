import NextAuth, { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";

interface Token extends JWT {
  accessToken?: string;
  refreshToken?: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          redirect_uri: "http://localhost:3000/api/auth/callback/google",
          prompt: "select_account",
          access_type: "offline",
          response_type: "code",
          scope:
            "https://www.googleapis.com/auth/calendar openid email profile",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }): Promise<Token> {
      if (account) {
        const newToken = {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
        };
        return newToken;
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        accessToken: (token as Token).accessToken,
        refreshToken: (token as Token).refreshToken,
      };
    },
  },
  // pages: {
  //   signIn: "/sign-in",
  //   signOut: "/sign-in",
  // },
};

export default NextAuth(authOptions);
