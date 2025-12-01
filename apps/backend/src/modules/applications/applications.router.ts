import { router, publicProcedure } from '../../server/trpc';
import { z } from 'zod';
import { prisma } from '../../server/context';

const applicationFormSchema = z.object({
  anyConcerns: z.string().optional().nullable(),
  authorizePayment: z.boolean(),
  billingZip: z.string(),
  cardName: z.string().optional().nullable(),
  cardNumber: z.string().optional().nullable(),
  childBirthDate: z.string(),
  childFullName: z.string(),
  childSex: z.string(),
  cvvNumber: z.string().optional().nullable(),
  desiredLocation: z.string(),
  desiredProgram: z.string(),
  email: z.string().email(),
  emailList: z.boolean(),
  expirationDate: z.string().optional().nullable(),
  nameOnCard: z.string().optional().nullable(),
  parentFirstName: z.string(),
  parentLastName: z.string(),
  paymentMethod: z.string(),
  phoneNumber: z.string(),
  programNotes: z.string().optional().nullable(),
});

export const applicationsRouter = router({
  submit: publicProcedure
    .input(applicationFormSchema)
    .mutation(async ({ input }) => {
      const app = await prisma.application.create({
        data: {
          // simple hard-coded campus for now, we’ll make this dynamic later
          siteKey: 'DM-RIVERPARK',
          status: 'SUBMITTED',
          procareSyncStatus: 'NOT_SENT',
          hasPaid: input.authorizePayment,

          // These map into your JSON columns on the Application model
          childData: {
            fullName: input.childFullName,
            birthDate: input.childBirthDate,
            sex: input.childSex,
          },
          guardiansData: [
            {
              firstName: input.parentFirstName,
              lastName: input.parentLastName,
              email: input.email,
              phone: input.phoneNumber,
            },
          ],
          otherData: {
            anyConcerns: input.anyConcerns,
            desiredLocation: input.desiredLocation,
            desiredProgram: input.desiredProgram,
            paymentMethod: input.paymentMethod,
            programNotes: input.programNotes,
            billingZip: input.billingZip,
            emailList: input.emailList,
            cardName: input.cardName,
            cardNumber: input.cardNumber,
            cvvNumber: input.cvvNumber,
            expirationDate: input.expirationDate,
            nameOnCard: input.nameOnCard,
          },
        },
      });

      return { id: app.id };
    }),
});
