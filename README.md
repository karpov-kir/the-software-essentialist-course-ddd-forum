# The software essentialist course DDD forum

This is my attempt to implement "Action: E2E Acceptance & Integration Testing on the Backend" assignment - https://www.essentialist.dev/products/the-software-essentialist/categories/2153382759/posts/2168948141. I used some code from the previous assignment https://github.com/karpov-kir/the-software-essentialist-course/pull/8.

All routes can be found in [routes.mts](./src/infra/webServer/routes.mts).

## Scripts

### Prerequisites

- Docker compose
  - Make sure Docker program / daemon is running
- Node.js >= 20.0.0
- NPM >= 8.0.0
- Don't forget to run `npm ci`

### Build

- `npm run build`

### Start

- `npm run start:dev` - for development
- `npm run start` - for production

### Test

- `npm run test:unit` or `npm run test:unit:dev` to run in watch mode 
- `npm run test:infra` or `npm run test:infra:dev` to run in watch mode
- `npm run test:e2e` or `npm run test:e2e:dev` to run in watch mode

## What's used

Tech stack:

- Prisma as ORM, but I didn't like it
  - I find it inconvenient to generate the client every time I change the schema, run tests, and start the server. I would prefer to use TypeORM or Sequelize instead (or maybe some other ORM).
  - The generated code is hard to debug
- PostgreSQL
- Fastify
- JWT for stateless authentication
- Docker compose to create development environment close to production

Architecture:

- Use cases from Clean architecture (to make controllers thin, stupid, and to isolate business logic from infra)
  - Some controllers still don't use Use cases because they are too simple e.g. [UsersController.mts](./src/modules/user/controllers/UsersController.mts)
- Ports and Adapters from Clean architecture
- Horizontal decoupling
- Vertical slicing

Patterns:

- [Object mother](https://martinfowler.com/bliki/ObjectMother.html)
- [Builder pattern](https://refactoring.guru/design-patterns/builder)
- Composition root
