# DDD forum best practices first

This is my attempt to implement "Action: E2E Acceptance & Integration Testing on the Backend" assignment - https://www.essentialist.dev/products/the-software-essentialist/categories/2153382759/posts/2168948141. I used some code from the previous assignment https://github.com/karpov-kir/the-software-essentialist-cource/pull/8.

All routes can be found in [routes.mts](./src/infra/webServer/routes.mts).

## Scripts

### Prerequisites

- Docker compose
- Node.js >= 20.0.0
- NPM >= 8.0.0
- `npm ci`

### Build

- `npm run build`

### Start

- `npm run start:dev` - for development
- `npm run start` - for production

### Test

- `npm run test:unit` or `npm run test:unit:dev` to run in watch mode 
- `npm run test:infra` or `npm run test:infra:dev` to run in watch mode
- `npm run test:e2e` or `npm run test:e2e:dev` to run in watch mode
