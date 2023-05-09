import { z } from 'zod'
import NodeGeocoder from 'node-geocoder'
import { publicProcedure, router } from '../trpc'

const geocoder = NodeGeocoder({
  provider: 'openstreetmap'
})

/*
    ID (Integer)
    First Name (String)
    Last Name (String)
    Address (String)
    Phone (String)
    Email (String)
    Mr./Mrs./Ms./Dr. (String)
    Contact By Mail (Boolean)
    Contact By Phone (Boolean)
    Contact BY Email (Boolean)
    Latitude (Real)
    Longitude (Real)
*/

// TODO: when switch to Postgres and Prisma enum, swtich this to enum as well
// const Title = z.enum(['Mr.', 'Mrs.', 'Ms.', 'Dr.'])

const Contact = z.object({
  id: z.number().optional(),
  firstName: z.string(),
  lastName: z.string(),
  address: z.string(),
  phone: z.string(),
  email: z.string(),
  title: z.string(),
  contactByMail: z.boolean(),
  contactByPhone: z.boolean(),
  contactByEmail: z.boolean(),
  latitude: z.number(),
  longitude: z.number()
})

export type Contact = z.infer<typeof Contact>;

export const contactsRouter = router({
  contacts: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.contact.findMany()
  }),
  contact: publicProcedure
    .input(
      z.object({
        id: z.number()
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.contact.findFirst({
        where: {
          id: input.id
        }
      })
    }),
  findByEmail: publicProcedure
    .input(
      z.object({
        email: z.string(),
        phone: z.string(),
        firstName: z.string(),
        lastName: z.string()
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.contact.findFirst({
        where: {
          email: input.email,
          phone: input.phone,
          firstName: input.firstName,
          lastName: input.lastName
        }
      })
    }),
  create: publicProcedure.input(Contact).query(async ({ ctx, input }) => {
    const { address } = input
    await geocoder.geocode(address).then((res) => {
      const { latitude, longitude, formattedAddress } = res[0]
      input.latitude = latitude as number
      input.longitude = longitude as number
      input.address = formattedAddress as string
    })
    return ctx.prisma.contact.create({
      data: input
    })
  }),
  update: publicProcedure.input(Contact).query(async ({ ctx, input }) => {
    const { address } = input
    const prevContact = await ctx.prisma.contact.findFirst({
      where: {
        id: input.id
      }
    }).then(res => res as Contact)
    if (prevContact.address !== address) {
      await geocoder.geocode(address).then((res) => {
        const { latitude, longitude, formattedAddress } = res[0]
        input.latitude = latitude as number
        input.longitude = longitude as number
        input.address = formattedAddress as string
      })
    }
    return ctx.prisma.contact.update({
      where: {
        id: input.id
      },
      data: input
    })
  }),
  delete: publicProcedure
    .input(
      z.object({
        id: z.number()
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.contact.delete({
        where: {
          id: input.id
        }
      })
    })
})
