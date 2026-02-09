import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import type { Context } from "./context";

export { AppRouter } from "./router";

// Initialize tRPC
const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error, ctx }) {
    if (error.code === "INTERNAL_SERVER_ERROR") {
      (ctx?.req.log as any)?.error?.(error);
      return { ...shape, message: "Internal server error" };
    }
    return shape;
  },
});

// ---------- Middlewares ----------

// ✅ Parent-only middleware
const parentAuthMiddleware = t.middleware(({ ctx, next }) => {
  if (!ctx.parent?.parentId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      parent: ctx.parent,
    },
  });
});

// ✅ Staff (authenticated user) middleware
const isAuthenticated = t.middleware(({ next, ctx }) => {
  if (!ctx.user) {
    throw new TRPCError({ message: "Unauthorized", code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      user: ctx.user,
    },
  });
});

// ✅ Admin-only middleware
const isAdmin = t.middleware(({ next, ctx }) => {
  if (!ctx.user || ctx.user.role !== "admin") {
    throw new TRPCError({ message: "Unauthorized", code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      user: ctx.user,
    },
  });
});

// ---------- Exports used by routers ----------

// Router
export const router = t.router;

// Public / no-auth procedures
export const publicProcedure = t.procedure;
export const noAuthProcedure = t.procedure;

// Staff-authenticated procedure
export const procedure = t.procedure.use(isAuthenticated);

// Admin-only procedure
export const adminProcedure = t.procedure.use(isAdmin);

// Parent-authenticated procedure
export const parentProcedure = t.procedure.use(parentAuthMiddleware);

