import userLogin from '@/libs/userLogin'
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  site: process.env.NEXTAUTH_URL_INTERNAL,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials, req) {
        try {
          if (!credentials.username | !credentials.password) return null
          const user = await userLogin(credentials.username, credentials.password)
          if (user.ok) {
            return user.json()
          } else {
            return null
          }
        } catch (e) {
          console.log(e)
        }
      }
    })
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user }
    },
    async session({ session, token, user }) {
      session.user = token
      return session
    }
  },
  pages: {
    signIn: '/login'
  }
}
const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
