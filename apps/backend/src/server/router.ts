import { authRouter } from '../modules/auth/auth.router';
import { applicationsRouter } from '../modules/applications/applications.router';
import { router } from './trpc';

export const appRouter = router({
  auth: authRouter,
  applications: applicationsRouter,
});

export type AppRouter = typeof appRouter;
