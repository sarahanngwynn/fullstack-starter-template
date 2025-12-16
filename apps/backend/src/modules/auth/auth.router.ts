import { noAuthProcedure, router } from '../../server/trpc';
import { z } from 'zod';
import { userCredentialsSchema } from './auth.dtos';
import { signIn, signUp } from './auth.service';
import { prisma } from '../../server/context';

export const authRouter = router({
  // 🔍 NEW: email-only check
  checkEmail: noAuthProcedure
    .input(
      z.object({
        email: z.string().email(),
      })
    )
    .query(async ({ input }) => {
      const email = input.email.trim().toLowerCase();

      const existingUser = await prisma.user.findUnique({
        where: { email },
        select: { id: true },
      });

      return { exists: !!existingUser };
    }),

  // ✅ existing
  signUp: noAuthProcedure
    .input(userCredentialsSchema)
    .mutation(async ({ input, ctx }) => signUp(input, ctx)),

  // ✅ existing
  signIn: noAuthProcedure
    .input(userCredentialsSchema)
    .mutation(async ({ input, ctx }) => signIn(input, ctx)),
});

