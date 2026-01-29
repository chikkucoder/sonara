import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import dbConnect from "@/lib/mongodb"
import User from "@/lib/models/User"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required")
        }

        await dbConnect()

        const user = await User.findOne({ email: credentials.email }).select("+password")

        if (!user) {
          throw new Error("Invalid email or password")
        }

        const isPasswordValid = await user.comparePassword(credentials.password)

        if (!isPasswordValid) {
          throw new Error("Invalid email or password")
        }

        if (!user.enabled) {
          throw new Error("Your account has been disabled. Please contact administrator.")
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.full_name,
          role: user.role,
          shop_id: user.shop_id,
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
  useSecureCookies: process.env.NODE_ENV === "production",
  trustHost: true,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id
        token.userRole = (user as any).role
        token.userShopId = (user as any).shop_id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.userId as string
        (session.user as any).role = token.userRole as string
        (session.user as any).shop_id = token.userShopId as string | undefined
      }
      return session
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
