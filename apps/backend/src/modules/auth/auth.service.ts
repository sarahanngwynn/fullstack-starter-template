import * as Prisma from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { SignInDto, SignUpDto } from './auth.dtos';
import * as jwt from 'jsonwebtoken'; // namespace import (no esModuleInterop needed)
import { authConfig } from '../../configs/auth.config';
import { hash, compare } from 'bcryptjs';
import { Context } from '../../server/context';

type UserResponse = Omit<Prisma.User, 'password'>;
type SignUpResult = UserResponse & { accessToken: string };

export const signUp = async (
  input: SignUpDto,
  ctx: Context
): Promise<UserResponse> => {
  const bcryptHash = await hash(input.password, 10);

  const user = await ctx.prisma.user.create({
    data: {
      email: input.email,
      password: bcryptHash,
      role: 'user',
    },
  });

  return {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    role: user.role,
  };
};

export const signIn = async (
  input: SignInDto,
  ctx: Context
): Promise<SignUpResult> => {
  const user = await ctx.prisma.user.findUnique({
    where: { email: input.email },
  });

  const authError = new TRPCError({
    message: 'Incorrect email or password',
    code: 'UNAUTHORIZED',
  });

  if (!user) throw authError;

  const ok = await compare(input.password, user.password);
  if (!ok) throw authError;

  const secret = authConfig.secretKey as jwt.Secret;
  if (!secret) {
    throw new Error('JWT secret is missing (set JWT_SECRET in your .env)');
  }

  // Nudge TS to the correct overload (payload, Secret, SignOptions)
  const payload: jwt.JwtPayload = { id: user.id, roles: user.role } as any;
  const options: jwt.SignOptions = { expiresIn: authConfig.jwtExpiresIn as any };

  const token = jwt.sign(payload, secret, options);

  return {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    role: user.role,
    accessToken: token,
  };
};


