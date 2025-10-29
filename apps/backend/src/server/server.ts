import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import fastify from 'fastify';
import { createContext } from './context';
import { appRouter } from './router';
import cors from '@fastify/cors';

export interface ServerOptions {
  dev?: boolean;
  port?: number;
  prefix?: string;
  environment: 'development' | 'production' | 'test' | 'local';
}

export function createServer(opts: ServerOptions) {
  const port = opts.port ?? 3000;
  const prefix = opts.prefix ?? '/trpc';

  // Keep it simple: use Fastify's built-in logger to avoid pino interop issues
  const server = fastify({ logger: true });

  server.register(cors, {
    origin: '*',
    methods: '*',
  });

  server.register(fastifyTRPCPlugin, {
    prefix,
    trpcOptions: { router: appRouter, createContext },
  });

  const stop = () => server.close();

  const start = async () => {
    try {
      await server.listen({ port });
    } catch (err) {
      // local cast silences over-strict typings without changing tsconfig
      (server.log as any).error(err);
      process.exit(1);
    }
  };

  return { server, start, stop };
}


