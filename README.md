Folder Structure with CQRS And DDD:
```bash
/src
  ├── modules
  │   ├── users
  │   │   ├── domain
  │   │   │   ├── entities
  │   │   │   ├── repositories
  │   │   │   ├── services
  │   │   │   └── value-objects
  │   │   ├── infrastructure
  │   │   │   ├── orm
  │   │   │   │   ├── user.entity.ts
  │   │   │   │   └── user.repository.ts
  │   │   │   └── mongodb
  │   │   │       ├── user.schema.ts
  │   │   │       └── user.repository.ts
  │   │   ├── application
  │   │   │   ├── dtos
  │   │   │   ├── commands
  │   │   │   │   ├── create-user.command.ts
  │   │   │   │   └── update-user.command.ts
  │   │   │   ├── command-handlers
  │   │   │   │   ├── create-user.handler.ts
  │   │   │   │   └── update-user.handler.ts
  │   │   │   ├── queries
  │   │   │   │   ├── get-user.query.ts
  │   │   │   │   └── get-users.query.ts
  │   │   │   └── query-handlers
  │   │   │       ├── get-user.handler.ts
  │   │   │       └── get-users.handler.ts
  │   │   ├── controllers
  │   │   └── users.module.ts
  │   └── products
  │       ├── domain
  │       │   ├── entities
  │       │   ├── repositories
  │       │   ├── services
  │       │   └── value-objects
  │       ├── infrastructure
  │       │   ├── orm
  │       │   │   ├── product.entity.ts
  │       │   │   └── product.repository.ts
  │       │   └── mongodb
  │       │       ├── product.schema.ts
  │       │       └── product.repository.ts
  │       ├── application
  │       │   ├── dtos
  │       │   ├── commands
  │       │   │   ├── create-product.command.ts
  │       │   │   └── update-product.command.ts
  │       │   ├── command-handlers
  │       │   │   ├── create-product.handler.ts
  │       │   │   └── update-product.handler.ts
  │       │   ├── queries
  │       │   │   ├── get-product.query.ts
  │       │   │   └── get-products.query.ts
  │       │   └── query-handlers
  │       │       ├── get-product.handler.ts
  │       │       └── get-products.handler.ts
  │       ├── controllers
  │       └── products.module.ts
  ├── common
  │   ├── decorators
  │   ├── exceptions
  │   ├── filters
  │   ├── interceptors
  │   ├── pipes
  │   └── utils
  ├── config
  │   ├── database.config.ts
  │   └── app.config.ts
  ├── shared
  │   ├── kernel
  │   ├── events
  │   └── base-classes
  ├── main.ts
  └── app.module.ts

```