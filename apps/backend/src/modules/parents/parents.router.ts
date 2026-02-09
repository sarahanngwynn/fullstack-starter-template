import { TRPCError } from "@trpc/server";
import { z } from "zod";
import * as jwt from "jsonwebtoken";
import { compare, hash } from "bcryptjs";

import { noAuthProcedure, parentProcedure, router } from "../../server/trpc";
import { authConfig } from "../../configs/auth.config";

// ---------- Zod schemas ----------
const childInputSchema = z.object({
  name: z.string().min(1, "Child name is required"),
  age: z.number().int().min(0).max(25),
});

const parentSignUpSchema = z.object({
  parentName: z.string().min(1, "Parent name is required"),
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  children: z.array(childInputSchema).optional().default([]),
});

const parentSignInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// ---------- Helpers ----------
function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function signParentToken(parentId: string) {
  const secret = authConfig.secretKey as jwt.Secret;
  if (!secret) {
    throw new Error("JWT secret is missing (set JWT_SECRET in your .env)");
  }

  // Parent token payload: recognized by createContext()
  const payload: jwt.JwtPayload = { parentId, type: "parent" } as any;
  const options: jwt.SignOptions = { expiresIn: authConfig.jwtExpiresIn as any };

  return jwt.sign(payload, secret, options);
}

// ---------- Router ----------
export const parentsRouter = router({
  checkEmail: noAuthProcedure
    .input(z.object({ email: z.string().email() }))
    .query(async ({ input, ctx }) => {
      const email = normalizeEmail(input.email);

      const existing = await ctx.prisma.parentAccount.findUnique({
        where: { email },
        select: { id: true },
      });

      return { exists: !!existing };
    }),

  signUp: noAuthProcedure
    .input(parentSignUpSchema)
    .mutation(async ({ input, ctx }) => {
      const email = normalizeEmail(input.email);

      const existing = await ctx.prisma.parentAccount.findUnique({
        where: { email },
        select: { id: true },
      });

      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "An account with that email already exists.",
        });
      }

      const passwordHash = await hash(input.password, 10);

      const parent = await ctx.prisma.parentAccount.create({
        data: {
          email,
          parentName: input.parentName.trim(),
          passwordHash,
          children: {
            create: input.children.map((c) => ({
              name: c.name.trim(),
              age: c.age,
            })),
          },
        },
        select: {
          id: true,
          email: true,
          parentName: true,
          createdAt: true,
          updatedAt: true,
          children: {
            select: { id: true, name: true, age: true, createdAt: true, updatedAt: true },
            orderBy: { createdAt: "asc" },
          },
        },
      });

      const accessToken = signParentToken(parent.id);

      return { ...parent, accessToken };
    }),

  signIn: noAuthProcedure
    .input(parentSignInSchema)
    .mutation(async ({ input, ctx }) => {
      const email = normalizeEmail(input.email);

      const parent = await ctx.prisma.parentAccount.findUnique({
        where: { email },
        include: { children: true },
      });

      const authError = new TRPCError({
        code: "UNAUTHORIZED",
        message: "Incorrect email or password",
      });

      if (!parent) throw authError;

      const ok = await compare(input.password, parent.passwordHash);
      if (!ok) throw authError;

      const accessToken = signParentToken(parent.id);

      return {
        id: parent.id,
        email: parent.email,
        parentName: parent.parentName,
        createdAt: parent.createdAt,
        updatedAt: parent.updatedAt,
        children: parent.children,
        accessToken,
      };
    }),

  // ✅ Parent-only: return the signed-in parent profile
  me: parentProcedure.query(async ({ ctx }) => {
    const parentId = ctx.parent.parentId;

    const parent = await ctx.prisma.parentAccount.findUnique({
      where: { id: parentId },
      select: {
        id: true,
        email: true,
        parentName: true,
        createdAt: true,
        updatedAt: true,
        children: {
          select: { id: true, name: true, age: true, createdAt: true, updatedAt: true },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!parent) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Parent account not found" });
    }

    return parent;
  }),
});

