import { z } from 'zod'
import { hash } from 'argon2'
import { publicProcedure, router } from '../trpc'
import { contactsRouter } from './contacts'

export const appRouter = router({
  contacts: contactsRouter,
  signUp: publicProcedure
    .input(
      z.object({
        username: z.string().min(3),
        password: z.string().min(3)
      })
    )
    .query(async ({ ctx, input }) => {
      const { username, password } = input
      const user = await ctx.prisma.user.create({
        data: {
          username,
          password: await hash(password)
        }
      })
      return user
    })
})

export type AppRouter = typeof appRouter
