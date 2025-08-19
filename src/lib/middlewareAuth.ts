// thin auth for middleware, which uses edge runtime
import NextAuth from "next-auth";

export const { auth } = NextAuth({
  providers: [], // can be empty; middleware only needs to decode the JWT
});
