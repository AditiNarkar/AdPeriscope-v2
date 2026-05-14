import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "demo",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "demo"
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID ?? "demo",
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "demo"
    })
  ],
  pages: {
    signIn: "/sign-in"
  },
  callbacks: {
    session({ session }) {
      return session;
    }
  }
});
