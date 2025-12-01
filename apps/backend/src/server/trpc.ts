import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import type { Context } from "./context";
export { AppRouter } from "./router";

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error, ctx }) {
    if (error.code === "INTERNAL_SERVER_ERROR") {
      (ctx?.req.log as any).error(error);
      return { ...shape, message: "Internal server error" };
    }
    return shape;
  },
});

// ---------- Middlewares ----------
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

export const router = t.router;

// ✅ Public / no-auth procedures (for things like your application form)
export const publicProcedure = t.procedure;
export const noAuthProcedure = t.procedure;

// ✅ Auth-required procedure (what you had before)
export const procedure = t.procedure.use(isAuthenticated);

// ✅ Admin-only
export const adminProcedure = t.procedure.use(isAdmin);
