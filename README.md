# NestJS E-Commerce Microservice — DDD / Hexagonal Architecture

A **research and reference benchmark** for building production-grade e-commerce backends using a NestJS monorepo of
microservices. This project rigorously applies Domain-Driven Design (DDD), Hexagonal (Ports & Adapters) Architecture,
Clean Architecture, and CQRS/Event Sourcing principles.

---

## Architecture Overview

```
Client (REST/SSE)
       │
       ▼
┌──────────────┐
│ gateway-svc  │  ← Single API Gateway (REST in, gRPC/NATS out)
└──────┬───────┘
       │ gRPC (sync)  /  NATS JetStream (async)
       ├────────────────┬────────────────┬──────────────────┐
       ▼                ▼                ▼                  ▼
 identity-svc     catalog-svc      inventory-svc       order-svc
 (auth + users)  (products,        (stock/SKU)        (cart, saga
                  variants)                             orchestrator)
                                          ▲                  │
                                          │       NATS events │
                              payment-svc ◄───────────────────┘
                              shipping-svc
                              notification-svc
                              review-svc
                              search-svc (Elasticsearch)
                              analytics-svc
```

### Communication

| Pattern         | Technology           | Use Case                                     |
|-----------------|----------------------|----------------------------------------------|
| Synchronous RPC | **gRPC**             | Gateway → service, service → service queries |
| Async events    | **NATS JetStream**   | Domain events, saga steps, notifications     |
| Client-facing   | **REST (HTTP/JSON)** | Gateway only                                 |
| Real-time push  | **SSE**              | Notifications to browser clients             |

### Distributed Patterns

- **Outbox Pattern** — Every service uses a transactional outbox for reliable at-least-once event publishing
- **Saga (Choreography)** — `order-service` owns the checkout saga; orchestrates payment, inventory, and shipping via
  NATS events
- **CQRS** — Commands and queries are strictly separated, with read-optimized projections where needed

---

## Bounded Contexts

| Service                | Status         | Responsibility                                  |
|------------------------|----------------|-------------------------------------------------|
| `identity-service`     | 🔄 Refactoring | Users, auth (JWT + Redis sessions), RBAC + ABAC |
| `gateway-service`      | 🔄 Refactoring | API Gateway, request routing, SSE               |
| `catalog-service`      | 📋 Planned     | Products, categories, variants, SKU, pricing    |
| `inventory-service`    | 📋 Planned     | Stock levels per variant/SKU                    |
| `order-service`        | 📋 Planned     | Cart, order lifecycle, saga orchestration       |
| `payment-service`      | 📋 Planned     | Payment processing, invoices, refunds           |
| `shipping-service`     | 📋 Planned     | Fulfillment, tracking                           |
| `notification-service` | 📋 Planned     | Email, SMS, push, SSE events                    |
| `review-service`       | 📋 Planned     | Product reviews and ratings                     |
| `search-service`       | 📋 Planned     | Full-text search (Elasticsearch)                |
| `analytics-service`    | 📋 Planned     | Reporting and metrics                           |

---

## Technology Stack

| Concern          | Technology                                    |
|------------------|-----------------------------------------------|
| Framework        | NestJS (monorepo)                             |
| Language         | TypeScript (strict mode)                      |
| Primary DB       | PostgreSQL + TypeORM (one schema per service) |
| Cache / Sessions | Redis                                         |
| Async messaging  | NATS JetStream                                |
| Sync RPC         | gRPC (Protocol Buffers)                       |
| Product search   | Elasticsearch / OpenSearch                    |
| Package manager  | Yarn 4.x                                      |

---

## Project Structure

```
apps/
├── gateway-service/     # REST API Gateway
├── identity-service/    # Auth & user management
└── ...                  # (planned services)

libs/
├── common/              # BaseAggregateRoot, BaseValueObject, DomainEvent, DomainException
├── contracts/           # Source of truth: gRPC protos, NATS event schemas, shared DTOs
└── infrastructure/      # Shared modules: PostgresModule, NatsJetStreamModule, RedisModule, gRPC configs
```

### Canonical Service Layer Structure

```
apps/<service>/src/
├── domain/
│   ├── models/          # Aggregate roots & entities (pure TypeScript, zero framework deps)
│   ├── value-objects/   # Immutable VOs with invariant enforcement
│   ├── events/          # Domain events
│   └── ports/           # Repository & service interfaces
├── application/
│   ├── commands/        # CQRS write: command + handler
│   ├── queries/         # CQRS read: query + handler
│   ├── dtos/            # Response DTOs
│   └── sagas/           # Saga orchestrators
├── infrastructure/
│   ├── persistence/     # TypeORM entities, mappers, repositories, migrations
│   ├── outbox/          # Transactional outbox processor
│   └── cache/           # Redis adapters
├── interface/
│   ├── grpc/            # gRPC controllers
│   └── nats/            # NATS event consumers
└── app.module.ts
```

---

## Getting Started

### Prerequisites

- Node.js (LTS v20.x+)
- Yarn 4.x (`corepack enable`)
- Docker (for PostgreSQL, Redis, NATS, Elasticsearch)

### Installation

```bash
git clone https://github.com/mahdi-vajdi/nestjs-microservice-example.git
cd nestjs-microservice-example
yarn install
```

### Infrastructure (Docker)

```bash
docker compose up -d
```

### Commands

```bash
yarn build      # Build all apps and libs
yarn lint       # ESLint
yarn test       # Jest unit tests
yarn format     # Prettier
```

---

## Key Design Principles

1. **Domain purity**: No NestJS decorators or ORM imports inside `domain/` folders.
2. **Value objects for all typed primitives**: Emails, prices, SKUs — never raw strings across aggregate boundaries.
3. **Outbox always**: Never publish domain events directly inside a command handler.
4. **Mapper pattern**: ORM entities never leave the infrastructure layer.
5. **Contracts as the single source of truth**: All inter-service interfaces live in `libs/contracts`.

---

## License

Released under the [MIT License](LICENSE).