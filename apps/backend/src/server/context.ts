import { inferAsyncReturnType, TRPCError } from '@trpc/server';
import { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';
import { verify } from 'jsonwebtoken';
import { authConfig } from '../configs/auth.config';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';


export const prisma = new PrismaClient();

export interface StaffUser {
  email: string;
  role: 'user' | 'admin';
}

export interface ParentAuth {
  type: 'parent';
  parentId: string;
}

const parentTokenSchema = z.object({
  type: z.literal('parent'),
  parentId: z.string().min(1),
});

const staffTokenSchema = z.object({
  email: z.string().email(),
  role: z.enum(['user', 'admin']),
});

// We return one of two shapes
type AuthDecoded =
  | { kind: 'parent'; parent: ParentAuth }
  | { kind: 'staff'; user: StaffUser };

async function decodeAndVerifyJwtToken(token: string): Promise<AuthDecoded> {
  const decoded = verify(token, authConfig.secretKey);

  // jsonwebtoken can return string or object; we only accept object
  if (!decoded || typeof decoded === 'string') {
    throw new TRPCError({ message: 'Unauthorized', code: 'UNAUTHORIZED' });
  }

  // Parent token?
  const parentCheck = parentTokenSchema.safeParse(decoded);
  if (parentCheck.success) {
    return { kind: 'parent', parent: parentCheck.data };
  }

  // Staff token?
  const staffCheck = staffTokenSchema.safeParse(decoded);
  if (staffCheck.success) {
    return { kind: 'staff', user: staffCheck.data };
  }

  throw new TRPCError({ message: 'Unauthorized', code: 'UNAUTHORIZED' });
}


export async function createContext({ req, res }: CreateFastifyContextOptions) {
  if (req.headers.authorization) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = await decodeAndVerifyJwtToken(token);

      if (decoded.kind === 'staff') {
        return { req, res, prisma, user: decoded.user };
      }

      return { req, res, prisma, parent: decoded.parent };
    } catch (err) {
      throw new TRPCError({ message: 'Unauthorized', code: 'UNAUTHORIZED' });
    }
  }

  return { req, res, prisma };
}

export type Context = inferAsyncReturnType<typeof createContext>;

