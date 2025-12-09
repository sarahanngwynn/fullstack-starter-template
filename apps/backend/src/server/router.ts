import { authRouter } from '../modules/auth/auth.router';
import { applicationsRouter } from '../modules/applications/applications.router';
import { registrationsRouter } from '../modules/registrations/registrations.router';
import { router } from './trpc';

export const appRouter = router({
  auth: authRouter,
  applications: applicationsRouter,
  registrations: registrationsRouter,
});

export type AppRouter = typeof appRouter;
