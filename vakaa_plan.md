# Vakaa Architecture Documentation and Plan

## Overview

Vakaa is a full-stack e-commerce application built with Vendure and Next.js, organized as a monorepo using bun workspaces. The project consists of two main applications:

1. **Server**: Vendure backend (GraphQL API, Admin Dashboard)
2. **Storefront**: Next.js frontend

## Project Structure

```
vakaa/
├── apps/
│   ├── server/       # Vendure backend (GraphQL API, Admin Dashboard)
│   └── storefront/   # Next.js frontend
└── package.json      # Root workspace configuration
```

## Development Setup

### Running the Application

To start both the server and storefront in development mode:

```bash
bun run dev
```

Or run them individually:

```bash
# Start only the server
bun run dev:server

# Start only the storefront
bun run dev:storefront
```

### Access Points

- **Vendure Dashboard**: http://localhost:3000/dashboard
- **Shop GraphQL API**: http://localhost:3000/shop-api
- **Admin GraphQL API**: http://localhost:3000/admin-api
- **Storefront**: http://localhost:3001

### Admin Credentials

Use these credentials to log in to the Vendure Dashboard:

- **Username**: superadmin
- **Password**: superadmin

## Production Build

Build all packages:

```bash
bun run build
```

Start the production server:

```bash
bun run start
```

## Server Dependencies

### Core Dependencies

- `@vendure/core`: 3.7.2
- `@vendure/dashboard`: 3.7.2
- `@vendure/asset-server-plugin`: 3.7.2
- `@vendure/email-plugin`: 3.7.2
- `@vendure/graphiql-plugin`: 3.7.2
- `react`: ^19.2.4
- `react-dom`: ^19.2.4

### Development Dependencies

- `@vendure/cli`: 3.7.2
- `@vendure/create`: 3.7.2
- `ts-node`: 10.9.2
- `typeorm`: ^1.1.1
- `typescript`: 5.8.2
- `vite`: ^7.3.1

## Storefront Dependencies

### Core Dependencies

- `next`: ^16.2.11
- `react`: ^19.2.8
- `react-dom`: ^19.2.8
- `@base-ui/react`: ^1.6.0
- `framer-motion`: ^13.5.0
- `lucide-react`: ^1.26.0
- `shadcn`: ^4.14.1
- `tailwindcss`: ^4.3.3

### Development Dependencies

- `@types/node`: ^26.1.1
- `@types/react`: ^19.2.17
- `@types/react-dom`: ^19.2.3
- `eslint`: ^9.39.5
- `eslint-config-next`: ^16.2.11
- `typescript`: ^6.0.3

## Development Workflow

1. **Development**: Use `bun run dev` to start both applications in development mode.
2. **Testing**: Run tests using `bun run test`.
3. **Building**: Use `bun run build` to create production builds.
4. **Deployment**: Start the production server with `bun run start`.

## Future Enhancements

- **Performance Optimization**: Implement caching strategies for the storefront.
- **Security**: Enhance security measures for both the server and storefront.
- **Scalability**: Plan for horizontal scaling of the application.
- **Monitoring**: Add monitoring and logging for better observability.

## Conclusion

This documentation provides a comprehensive overview of the Vakaa architecture and development workflow. By following the guidelines and using the provided scripts, developers can efficiently set up, develop, and deploy the application.