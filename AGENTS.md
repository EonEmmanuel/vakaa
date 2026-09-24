# vakaa Project Instructions

This project was generated with `@vendure/create`.

## Workspace Layout

- Vendure backend: `apps/server`
- Next.js storefront: `apps/storefront`
- Start both apps: `bun run dev`
- Start only the server: `bun run dev:server`
- Start only the storefront: `bun run dev:storefront`
- Backend custom code belongs in `apps/server/src/plugins`
- Backend runtime configuration is in `apps/server/src/vendure-config.ts`
- Backend static assets and email templates live in `apps/server/static`

## Vendure Development

- Prefer implementing custom functionality as a Vendure plugin.
- Use `bun x vendure add` to scaffold plugins, entities, services, API extensions, and job queues.
- Read environment variables in `vendure-config.ts` and pass values into plugins through `Plugin.init()` options.
- Create job queues in `onModuleInit()` or `onApplicationBootstrap()`, then reuse the queue when adding jobs.
- Pass `RequestContext` to Vendure services and `TransactionalConnection` methods when it is available.
- Do not commit `.env` values or generated runtime data.
- Do not use `dbConnectionOptions.synchronize: true` for production data.

## Commands

- Start development: `bun run dev`
- Build: `bun run build`

## Quality Checks

- Run `npm run build` after changing backend code.
- Run targeted tests for the package or feature you changed.
