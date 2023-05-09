import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaClient } from '@prisma/client'
import { verify } from 'argon2'
import { NuxtAuthHandler } from '#auth'

const prisma = new PrismaClient()

export default NuxtAuthHandler({
  // secret needed to run nuxt-auth in production mode (used to encrypt data)
  secret: process.env.NUXT_SECRET,
  pages: {
    signIn: '/login'
  },
  providers: [
    // @ts-ignore Import is exported on .default during SSR, so we need to call it this way. May be fixed via Vite at some point
    CredentialsProvider.default({
      name: 'Credentials',
      async authorize(credentials: { username: string, password: string }) {
        const user = await prisma.user.findUnique({
          where: {
            username: credentials.username
          }
        })
        if (!user) {
          console.error('Warning: Malicious login attempt registered, bad credentials provided')
          return null
        }
        const valid = await verify(user.password, credentials.password)
        if (!valid) {
          console.error('Warning: Malicious login attempt registered, bad credentials provided')
          return null
        }
        return {
          name: user.username
        }
      }
    })
  ]
})
