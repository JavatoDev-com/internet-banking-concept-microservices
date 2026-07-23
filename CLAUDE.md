# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Always refer to the `ai-dlc/` folder for all process configurations before starting any work.

## Development Process (MANDATORY)

Full process is defined in [ai-dlc/coding-assistant.md](ai-dlc/coding-assistant.md). Every session follows this flow without exception:

0. **Branch check** — run `git branch --show-current`. If `main` or `develop` → **reject development**, stop entirely.
1. **Open** — respond with `development: {topic}`, then ask: "What are you planning to build or change here?"
2. **Assess the plan** — if it's clear, proceed. Only ask follow-up questions for genuine gaps you cannot resolve yourself.
3. **Decision log** — `ai-dlc/decision-logs/dl-{unix_epoch}_{HHMMSS}-{prefix}.log`
4. **Task file** — `ai-dlc/tasks/task-{unix_epoch}_{HHMMSS}-{prefix}.log` with `STATUS: PENDING` (same timestamp as DL)
5. **Implement** — update task to `IN_PROGRESS`
6. **Build** — run `./gradlew clean build` from within the affected service directory; must pass; fix failures, do not skip
7. **API Contracts** — `ai-dlc/api-contracts/api-contract-{unix_epoch}_{HHMMSS}-{prefix}.log` — **mandatory** whenever any controller layer is added or changed (new endpoint, modified endpoint, removed endpoint). Document every affected endpoint as a ready-to-import curl command in `.md` format. Skip only when zero controller files are touched.
8. **Complete** — update task to `STATUS: COMPLETE` with build result

Templates are at `ai-dlc/templates/`.

---

## Project Overview

This is the **Internet Banking Concept** — a microservices-based internet banking platform. It manages user registration, authentication, fund transfers, utility payments, and account management across independently deployable Spring Boot services.

**Modules:**

| Service | Port | Responsibility |
|:---|:---|:---|
| `internet-banking-service-registry` | 8081 | Netflix Eureka — service discovery |
| `internet-banking-api-gateway` | 8082 | Spring Cloud Gateway — routing + OAuth2/JWT security |
| `internet-banking-user-service` | 8083 | User registration, profile management, Keycloak integration |
| `internet-banking-fund-transfer-service` | 8084 | Fund transfers between accounts |
| `internet-banking-utility-payment-service` | 8085 | Utility bill payments |
| `internet-banking-config-server` | 8090 | Spring Cloud Config Server — centralised configuration |
| `core-banking-service` | 8092 | Core banking: accounts, transactions, user data |

**Core Stack:**
* Java 21
* Spring Boot 3.2.4
* Spring Cloud 2023.0.0
* Gradle
* MySQL (Spring Data JPA)
* Flyway (database migrations — `core-banking-service` only)
* Netflix Eureka (service discovery)
* Spring Cloud Gateway (reactive, with WebFlux)
* Spring Cloud Config (centralised config)
* OpenFeign (inter-service HTTP calls)
* Keycloak 23 (identity provider — OAuth2/JWT)
* Micrometer + Zipkin (distributed tracing)
* Springdoc OpenAPI / Swagger UI
* Lombok
* Docker / Docker Compose

---

## Build & Run Commands

Each service is an independent Gradle project. Run commands from within the service directory.

```bash
# Build (excluding tests) — run from within a service directory
./gradlew build -x test

# Run tests
./gradlew test

# Run a single test class
./gradlew test --tests "com.javatodev.finance.SomeTestClass"

# Run the application
./gradlew bootRun
```

**Profiles:**
* `dev` — local development (bootstrap-dev.yml)
* `docker` — containerised (bootstrap-docker.yml)

**Docker Compose** — starts the full platform including Keycloak, MySQL, Zipkin, and all services:
```bash
docker-compose -f docker-compose/docker-compose.yml up
```

---

## Package Structure

All services share the base package `com.javatodev.finance`. Per-service structure:

### core-banking-service
```
com.javatodev.finance/
├── controller/
│   ├── AccountController       (/api/v1/account)
│   ├── TransactionController
│   └── UserController
├── service/
│   ├── AccountService
│   ├── TransactionService
│   └── UserService
├── model/
│   ├── dto/                    # BankAccount, Transaction, User, UtilityAccount, request/*, response/*
│   ├── entity/                 # BankAccountEntity, TransactionEntity, UserEntity, UtilityAccountEntity
│   └── mapper/                 # BankAccountMapper, UserMapper, UtilityAccountMapper, BaseMapper
├── repository/                 # BankAccountRepository, TransactionRepository, UserRepository, UtilityAccountRepository
├── exception/                  # SimpleBankingGlobalException, EntityNotFoundException, InsufficientFundsException, ...
└── resources/
    └── db/migration/           # Flyway SQL scripts
```

### internet-banking-user-service
```
com.javatodev.finance/
├── controller/
│   └── UserController          (/api/v1/bank-users)
├── service/
│   ├── UserService
│   ├── KeycloakUserService
│   └── rest/BankingCoreRestClient   (Feign client → core-banking-service)
├── model/
│   ├── dto/                    # User, UserUpdateRequest, AuditAware, Status
│   ├── entity/                 # UserEntity
│   ├── mapper/                 # UserMapper, BaseMapper
│   ├── repository/             # UserRepository
│   └── rest/response/          # UserResponse, AccountResponse
├── configuration/
│   ├── audit/                  # AuditConfig, AuditorAwareConfig
│   ├── feign/                  # CustomFeignClientConfiguration, CustomFeignErrorDecoder
│   ├── filter/                 # AppAuthUserFilter, ApiRequestContext, ApiRequestContextHolder
│   └── keycloak/               # KeycloakManager, KeycloakProperties
└── exception/                  # SimpleBankingGlobalException, EntityNotFoundException, ...
```

### internet-banking-fund-transfer-service
```
com.javatodev.finance/
├── controller/
│   └── FundTransferController
├── service/
│   ├── FundTransferService
│   └── rest/client/BankingCoreFeignClient   (Feign client → core-banking-service)
├── model/
│   ├── dto/                    # FundTransfer, AuditAware, request/*, response/*
│   ├── entity/                 # FundTransferEntity
│   ├── mapper/                 # FundTransferMapper, BaseMapper
│   └── repository/             # FundTransferRepository
├── configuration/              # CustomFeignClientConfiguration, audit/*, filter/*
└── exception/
```

### internet-banking-utility-payment-service
```
com.javatodev.finance/
├── controller/
│   └── UtilityPaymentController
├── service/
│   ├── UtilityPaymentService
│   └── rest/BankingCoreRestClient   (Feign client → core-banking-service)
├── model/
│   ├── dto/                    # UtilityPayment, AuditAware
│   ├── entity/                 # UtilityPaymentEntity
│   ├── mapper/                 # UtilityPaymentMapper, BaseMapper
│   ├── repository/             # UtilityPaymentRepository
│   └── rest/                   # request/*, response/*
├── configuration/              # CustomFeignClientConfiguration, audit/*, filter/*
└── exception/
```

### internet-banking-api-gateway
```
com.javatodev.finance/
└── configuration/
    ├── GatewayConfiguration         # Route definitions
    └── security/SecurityConfiguration  # OAuth2 resource server + security filter chain
```

### internet-banking-config-server
```
com.javatodev.finance/
└── InternetBankingConfigServerApplication  # @EnableConfigServer entry point
```

### internet-banking-service-registry
```
com.javatodev.finance/
└── InternetBankingServiceRegistryApplication  # @EnableEurekaServer entry point
```

---

## General Development Rules

### Code Quality

* Write production-grade code only.
* Prefer readability over clever implementations.
* Follow SOLID principles.
* Avoid code duplication.
* Keep methods small and focused.
* Use meaningful variable and method names.
* Favor composition over inheritance.

### Java Conventions

* Use Java 21 features where appropriate.
* Prefer records for immutable DTOs.
* Use Optional carefully for return values.
* Avoid returning null.
* Use Streams only when they improve readability.
* Prefer constructor injection over field injection.
* Never use `@Autowired` on fields.

Example:

```java
@Service
@RequiredArgsConstructor
public class FundTransferService {

    private final FundTransferRepository fundTransferRepository;
    private final BankingCoreFeignClient bankingCoreFeignClient;

}
```

---

## Spring Boot Standards

### Controllers

Controllers should:

* Contain no business logic.
* Delegate work to services.
* Validate requests.
* Use `@Slf4j`, `@Tag` (Swagger), and `@Operation` annotations.

Base API paths per service:

| Service | Base Path |
|:---|:---|
| `core-banking-service` | `/api/v1/account`, `/api/v1/transaction`, `/api/v1/user` |
| `internet-banking-user-service` | `/api/v1/bank-users` |
| `internet-banking-fund-transfer-service` | `/api/v1/fund-transfer` |
| `internet-banking-utility-payment-service` | `/api/v1/utility-payment` |

Example:

```java
@Slf4j
@Tag(name = "Fund Transfer Controller", description = "APIs for managing fund transfers")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/fund-transfer")
public class FundTransferController {

    private final FundTransferService fundTransferService;

    @Operation(summary = "Initiate Fund Transfer")
    @PostMapping
    public ResponseEntity<FundTransferResponse> fundTransfer(@RequestBody FundTransferRequest request) {
        log.info("Initiating fund transfer for request {}", request);
        return ResponseEntity.ok(fundTransferService.fundTransfer(request));
    }
}
```

### Services

Services should:

* Contain all business logic.
* Be transaction boundaries.
* Not expose entities directly — use mappers.

### Repositories

* Use Spring Data JPA (`JpaRepository`).
* Keep repositories interface-only unless custom `@Query` is needed.
* Services inject repositories directly — no custom base repository layer needed.

---

## Validation

Always validate incoming requests using Bean Validation annotations.

Example:

```java
public record FundTransferRequest(

        @NotBlank
        String fromBankAccountNumber,

        @NotBlank
        String toBankAccountNumber,

        @NotNull
        @Positive
        BigDecimal amount
) {}
```

---

## Exception Handling

Use centralized exception handling via `GlobalExceptionHandler` in the `exception/` package of each service.

**Base exception class:** `SimpleBankingGlobalException extends RuntimeException`

**Exception hierarchy** (per service, all extend `SimpleBankingGlobalException`):

```
SimpleBankingGlobalException
├── EntityNotFoundException
├── InsufficientFundsException          (core-banking-service)
├── InvalidBankingUserException         (internet-banking-user-service)
├── InvalidEmailException               (internet-banking-user-service)
└── UserAlreadyRegisteredException      (internet-banking-user-service)
```

Error response format:
```json
{
  "code": "ENTITY_NOT_FOUND",
  "message": "Bank account not found"
}
```

Never expose stack traces to clients. `GlobalExceptionHandler` handles both `SimpleBankingGlobalException` subtypes and unexpected `Exception`.

---

## Logging

Use structured logging with `@Slf4j` (Lombok).

Good:
```java
log.info("Initiating fund transfer. from={}, to={}, amount={}", fromAccount, toAccount, amount);
```

Bad:
```java
System.out.println("Transfer started");
```

Rules:
* INFO for business events
* WARN for recoverable issues
* ERROR for failures
* Never log secrets or PII

---

## Database

### MySQL (Spring Data JPA)

Services that use JPA: `core-banking-service`, `internet-banking-user-service`, `internet-banking-fund-transfer-service`, `internet-banking-utility-payment-service`.

**Flyway migrations** are used only in `core-banking-service` under `src/main/resources/db/migration/`.

Migration naming: `V1.0.{timestamp}__{description}.sql`

**Tables per service:**

| Entity | Table | Service |
|:---|:---|:---|
| `UserEntity` | `banking_core_user` | core-banking-service |
| `BankAccountEntity` | `banking_core_account` | core-banking-service |
| `UtilityAccountEntity` | `banking_core_utility_account` | core-banking-service |
| `TransactionEntity` | transactions table | core-banking-service |
| `UserEntity` | user table | internet-banking-user-service |
| `FundTransferEntity` | fund_transfer table | internet-banking-fund-transfer-service |
| `UtilityPaymentEntity` | utility_payment table | internet-banking-utility-payment-service |

### Entity Guidelines

* Keep entities persistence-focused.
* Avoid business logic inside entities.
* Use Lombok on entities.
* Use `Long` IDs with `@GeneratedValue(strategy = GenerationType.IDENTITY)`.

Example:

```java
@Entity
@Table(name = "banking_core_account")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BankAccountEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

}
```

### Test Database

Tests use **H2 in-memory** database. Each service has `src/test/resources/application.yml` configuring H2.

---

## Inter-Service Communication

Services communicate via **OpenFeign** (declarative REST clients).

`internet-banking-user-service`, `internet-banking-fund-transfer-service`, and `internet-banking-utility-payment-service` call `core-banking-service` for account data.

Feign clients go in `service/rest/` or `service/rest/client/`.

Example:

```java
@FeignClient(name = "core-banking-service", configuration = CustomFeignClientConfiguration.class)
public interface BankingCoreFeignClient {

    @GetMapping("/api/v1/account/bank-account/{accountNumber}")
    BankAccount getBankAccount(@PathVariable("accountNumber") String accountNumber);

}
```

---

## Security

* The API gateway (`internet-banking-api-gateway`) enforces OAuth2/JWT authentication using **Keycloak** as the identity provider.
* Downstream services receive user identity via `AppAuthUserFilter` (reads JWT claims from the forwarded `Authorization` header).
* `ApiRequestContext` / `ApiRequestContextHolder` hold the request-scoped user principal within services.
* Never hardcode secrets.
* Read secrets from environment variables or Spring Cloud Config.
* Validate all inputs.
* Follow OWASP recommendations.

---

## Distributed Tracing

All services include **Micrometer + Zipkin** for distributed tracing:

* `spring-boot-starter-actuator`
* `micrometer-tracing-bridge-brave`
* `zipkin-reporter-brave`

Zipkin UI runs at `http://localhost:9411`.

---

## Documentation (Swagger)

All services expose Swagger UI via **springdoc-openapi**. Controllers must use `@Tag` and `@Operation` annotations.

---

## Performance

Before implementing:

1. Consider query count.
2. Avoid N+1 queries — use JPA `@Query` with joins when needed.
3. Use pagination for list endpoints (`Pageable`).
4. Cache only when justified.

---

## When Generating Code

Claude should:

1. Produce complete compilable code.
2. Include imports.
3. Follow existing package structure (`com.javatodev.finance`).
4. Prefer maintainability over brevity.
5. Explain architectural decisions when relevant.
6. Generate tests alongside business logic (JUnit 5 + Mockito + H2).
7. Avoid introducing unnecessary libraries.
8. Follow project conventions before introducing new patterns.
9. Use `@Slf4j` for logging (Lombok).
10. Use `@RequiredArgsConstructor` with constructor injection only.
11. New exception types go in the `exception/` package and must extend `SimpleBankingGlobalException`.
12. Flyway migrations go in `core-banking-service/src/main/resources/db/migration/` only.
13. Feign clients go in `service/rest/` or `service/rest/client/`.

---

## Output Expectations

When asked to implement a feature:

1. Explain the approach.
2. Show affected files.
3. Generate complete code.
4. Include tests.
5. Mention database/schema changes if needed.
6. Mention configuration changes if needed.

Always assume this is a production system.

---

## Decision Log & Task Tracking

All decisions and tasks are tracked in the `ai-dlc/` folder. See [ai-dlc/coding-assistant.md](ai-dlc/coding-assistant.md) for the full workflow.

**Decision logs** — `ai-dlc/decision-logs/dl-{unix_epoch}_{HHMMSS}-{prefix}.log`
**Task files** — `ai-dlc/tasks/task-{unix_epoch}_{HHMMSS}-{prefix}.log`

Every decision log includes: Author, Date, Purpose, Q&A, decisions made, alternatives considered, scope, risks, and acceptance criteria.
Every task file tracks: STATUS (PENDING → IN_PROGRESS → COMPLETE), implementation plan, build verification result, and completion timestamp.
