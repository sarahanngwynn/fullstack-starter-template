import { router, publicProcedure } from '../../server/trpc';
import { z } from 'zod';
import { prisma } from '../../server/context';

// Shape of the data your register flow is sending
const registrationSchema = z.object({
  email: z.string().email().optional().nullable(),
  password: z.string().optional().nullable(),

  divorce: z.string().optional().nullable(),
  custody: z.string().optional().nullable(),
  immunization: z.string().optional().nullable(),

  cardName : z.string().optional().nullable(),
  cardNumber: z.string().optional().nullable(),
  expirationDate: z.string().optional().nullable(),
  cvvNumber: z.string().optional().nullable(),

  schedule: z.string().optional().nullable(),
  allergies: z.string().optional().nullable(),
  listOfAllergies: z.string().optional().nullable(),
  support: z.string().optional().nullable(),
  listSupport: z.string().optional().nullable(),

  tgMembership: z.string().optional().nullable(),
  whichChild: z.array(z.string()).default([]),

  // if you ever use this as a yes/no checkbox list
  emailList: z.array(z.string()).default([]).optional(),
});

export const registrationsRouter = router({
  submit: publicProcedure
    .input(registrationSchema)
    .mutation(async ({ input }) => {
      // For now we’ll store registrations in the same Application table
      // using the JSON columns, tagged as type: "REGISTRATION".
      const app = await prisma.application.create({
        data: {
          siteKey: 'DM-RIVERPARK',
          status: 'SUBMITTED',
          procareSyncStatus: 'NOT_SENT',
          hasPaid: !!input.cardNumber, // totally fine to tweak later

          childData: {
            whichChild: input.whichChild,
            schedule: input.schedule,
          },
          guardiansData: [
            {
              email: input.email,
            },
          ],
          otherData: {
            formType: 'REGISTRATION',
            divorce: input.divorce,
            custody: input.custody,
            immunization: input.immunization,
            allergies: input.allergies,
            listOfAllergies: input.listOfAllergies,
            support: input.support,
            listSupport: input.listSupport,
            tgMembership: input.tgMembership,
            emailList: input.emailList,
            payment: {
              cardName : input.cardName,
              cardNumber: input.cardNumber,
              expirationDate: input.expirationDate,
              cvvNumber: input.cvvNumber,
            },
          },
        },
      });

      return { id: app.id };
    }),
});
