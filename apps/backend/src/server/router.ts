import { authRouter } from '../modules/auth/auth.router';
import { applicationsRouter } from '../modules/applications/applications.router';
import { registrationsRouter } from '../modules/registrations/registrations.router';
import { router } from './trpc';
import { parentsRouter } from "../modules/parents/parents.router";


export const appRouter = router({
  auth: authRouter,
  applications: applicationsRouter,
  registrations: registrationsRouter,
  parents: parentsRouter,
});

export type AppRouter = typeof appRouter;
