import { trpc } from '../utils/trpc';

export const useRegistrationMutation = () =>
  trpc.registrations.submit.useMutation();
