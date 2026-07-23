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
6. **Build** — `./gradlew clean build` must pass; fix failures, do not skip
7. **API Contracts** — `ai-dlc/api-contracts/api-contract-{unix_epoch}_{HHMMSS}-{prefix}.log` — **mandatory** whenever any controller layer is added or changed (new endpoint, modified endpoint, removed endpoint). Document every affected endpoint as a ready-to-import curl command in `.md` format. Skip only when zero controller files are touched.
8. **Complete** — update task to `STATUS: COMPLETE` with build result

Templates are at `ai-dlc/templates/`.

## Project Overview

This is the central orchestration hub for the Socialic platform. It manages the full content lifecycle — creation, scheduling, platform publishing, file management, AI agents, comments, and engagement metrics.

**Core Stack:**
* Java 21
* Spring Boot 3.2.4
* Gradle
* MongoDB (Spring Data MongoDB)
* RabbitMQ (AMQP)
* AWS S3, SQS, KMS (SDK v2)
* Pusher (WebSocket notifications)
* OpenFeign (inter-service HTTP)
* Netflix Eureka (service discovery)
* Docker
* Lombok

---

## Build & Run Commands

```bash
# Build (excluding tests)
./gradlew build -x test

# Run tests
./gradlew test

# Run a single test class
./gradlew test --tests "com.avron.socialic.SomeTestClass"

# Code quality checks
./gradlew pmdMain          # PMD static analysis (config: config/pmd/ruleset.xml)
./gradlew checkstyleMain   # Checkstyle validation (config: config/checkstyle/checkstyle.xml)
./gradlew sonarqube        # SonarQube analysis

# Run the application (requires env vars — see Required Environment Variables below)
./gradlew bootRun
```

---

## Required Environment Variables

```bash
# MongoDB
SOCIALIC_APP_DB_USERNAME
SOCIALIC_APP_DB_PASSWORD

# RabbitMQ
SOCIALIC_APP_RABBITMQ_HOST
SOCIALIC_APP_RABBITMQ_USERNAME
SOCIALIC_APP_RABBITMQ_PASSWORD

# AWS
SOCIALIC_APP_AWS_ACCESS_KEY
SOCIALIC_APP_AWS_SECRET_KEY
SOCIALIC_APP_AWS_REGION

# Pusher
SOCIALIC_APP_CONFIG_PUSHER_SECRET
```

---

## Package Structure

```
com.avron.socialic/
├── config/              # Spring configurations (MQ, AWS, Feign, Pusher, Security filters)
│   ├── amazon/          # AWS S3, SQS, KMS client beans
│   ├── exception/       # GlobalExceptionHandler, ErrorResponse
│   ├── feign/           # Feign config, interceptor, error decoder
│   ├── filter/          # AppAuthUserFilter, CorrelationIdFilter, ApiRequestContext
│   ├── mq/              # RabbitMqConfig (queues, exchanges, bindings)
│   ├── props/           # AmazonCoreProperties, S3, SQS property classes
│   ├── pusher/          # PusherConfig
│   └── subcription/     # SubscriptionLimitConfig, LimitData
├── controller/          # 7 REST controllers (no business logic)
├── service/             # 24+ services (business logic layer)
│   ├── agent/           # AgentService
│   ├── comment/         # SocialCommentService, CommentSyncProcessor
│   ├── kms/             # KmsEncryptionService
│   ├── linkedin/        # LinkedinPublisherService
│   ├── meta/            # MetaContentPublisherService
│   ├── metrics/         # ContentMetricsService, MetricsSyncProcessor
│   ├── mq/              # MessageQueueDataProcessor, MessageQueueDataPublisher
│   ├── pinterest/       # PinterestPublisherService
│   ├── pusher/          # PusherDataService
│   ├── s3/              # S3FileService, S3ContentCreationService
│   ├── subscription/    # SubscriptionBasedValidationService
│   ├── threads/         # ThreadsPublisherService
│   ├── tiktok/          # TiktokPublisherService
│   ├── youtube/         # YoutubePublisherService
│   └── validator/       # Strategy-pattern validators per platform
├── exception/           # 15 custom exception types
├── model/               # All DTOs, entities, mappers, repositories
│   ├── agent/           # Agent + GeneratedPost (dto/entity/mapper/repository)
│   ├── analytics/
│   ├── bulk/            # BulkContent (dto/entity/mapper/repository)
│   ├── comment/         # SocialComment (dto/entity/mapper/repository/enums)
│   ├── common/          # PageResponse, SortOrder, AuditAware, BaseMapper
│   ├── connector/       # ConnectorApiClient (Feign), Channel DTOs
│   ├── content/         # SocialContent (dto/entity/mapper/repository) — main model
│   ├── file/            # File (dto/entity/mapper/repository)
│   ├── metrics/         # ContentMetrics (dto/entity/repository)
│   ├── paddle/          # Subscription/billing DTOs
│   ├── plugin/          # PluginContent (dto/entity/mapper/repository)
│   ├── publisher/       # Meta, Pinterest, TikTok platform-specific DTOs + Feign clients
│   ├── usage/
│   └── user/            # UserApiClient (Feign), SocialicUser DTO
└── util/                # StringUtil, FileUtils, TimeUtils, ChannelDataUtil, etc.
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
public class UserService {

    private final UserRepository userRepository;

}
```

---

## Spring Boot Standards

### Controllers

Controllers should:

* Contain no business logic.
* Delegate work to services.
* Validate requests.

Base API path: `/api/v1/`

Existing controllers:

| Controller | Base Path | Key Operations |
|:---|:---|:---|
| `ContentController` | `/api/v1/contents` | CRUD, bulk creation, cross-posting, scheduling |
| `CommentController` | `/api/v1/contents/{contentId}/comments` | Comment CRUD + platform sync |
| `FileManagerController` | `/api/v1/file-manager` | File upload, presigned URLs |
| `AgentController` | `/api/v1/agents` | AI agent + generated post management |
| `MetricsController` | `/api/v1/metrics` | Engagement metrics |
| `AnalyticsController` | `/api/v1/analytics` | Analytics queries |
| `PluginDataController` | `/api/v1/plugins` | Plugin-initiated content |

Example:

```java
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    @GetMapping("/{id}")
    public UserResponse getUser(
            @PathVariable Long id) {
        return userService.getUser(id);
    }
}
```

### Services

Services should:

* Contain business logic.
* Be transaction boundaries.
* Not expose entities directly.

### Repositories

* Use Spring Data MongoDB (not JPA).
* Follow the two-layer pattern described in the **Repository Pattern** section.
* Use mappers appropriately to map DTO → Entity and vice versa.

### Response Format

All response messages must come from `messages/response/messages.properties` — never hardcode.

Success:

```json
{
  "data": {}
}
```

Error: Error messages must come from `messages/exception/messages.properties`.

```json
{
  "code": "USER_NOT_FOUND",
  "message": "User not found"
}
```

---

## Validation

Always validate incoming requests. When building a feature, ask the user about validations and confirm before applying.

Example:

```java
public record CreateUserRequest(

        @NotBlank
        String name,

        @Email
        String email
) {}
```

### Platform-Specific Content Validation

Content validation uses the **Strategy Pattern** with per-platform validators. Limits are configured in `application.yml` under `validation.strategy.*`:

| Platform | Key Limits |
|:---|:---|
| Instagram | Max 10 images, 1 video, or 10 mixed; description ≤ 2200 chars |
| Facebook | Max 10 images, 1 video, or 10 mixed; description ≤ 63206 chars |
| TikTok | Video only or carousel (max 35 images); description ≤ 2200 chars |
| Pinterest | Max 35 images; title ≤ 100, description ≤ 500, alt-text ≤ 500 |
| YouTube | Single video only; category ID required; description ≤ 5000 chars |
| LinkedIn Profile | Max 1 image or 1 video; description ≤ 3000 chars |
| LinkedIn Page | Same limits as profile, organization variant |
| Threads | Max 1 image OR 1 video (no mixed); description ≤ 500 chars |

**Key classes:**
- `SocialContentValidator` — orchestrates validation
- `ValidationStrategyFactory` — creates the right validator by `ChannelType`
- `AbstractValidationStrategy` — base class for all validators
- `ValidationHelper` — shared utility methods

---

## Exception Handling

Use centralized exception handling via `GlobalExceptionHandler` in `config/exception/`.

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

}
```

Never expose stack traces to clients.

**Exception hierarchy** (all extend `SocialicGlobalException`):

```
SocialicGlobalException
├── EntityNotFoundException
├── InvalidChannelsException
├── InvalidContentStatusException
├── ContentLimitExceedException
├── ContentSpaceExceedException
├── InvalidMediaTypeException
├── FileProcessingException
├── DataMapperException
├── FeignClientException
├── MQMessageHandlingException
├── SQSMessageProcessingException
├── BulkCreationValidationException
├── BulkCreationProcessingException
├── EmptyBulkContentException
└── AgentDataCreationCommonException
```

All exception messages go in `messages/exception/messages.properties`.

---

## Logging

Use structured logging with `@Slf4j` (Lombok).

Good:

```java
log.info("User created. userId={}", userId);
```

Bad:

```java
System.out.println("User created");
```

Rules:

* INFO for business events
* WARN for recoverable issues
* ERROR for failures
* Never log secrets
* Correlation ID is automatically added to MDC via `CorrelationIdFilter` and appears in every log line as `[X-Correlation-ID]`

---

## Database

### MongoDB (Spring Data MongoDB)

This service uses **MongoDB**, not relational JPA. There are no SQL migrations or Flyway.

**Database:** `socialic-social-content-database` on MongoDB Atlas

**Collections and their entities:**

| Entity Class | Collection | Purpose |
|:---|:---|:---|
| `SocialContentEntity` | `social_contents` | Main content posts |
| `BulkContentEntity` | `bulk_contents` | Bulk creation jobs |
| `FileEntity` | `files` | File metadata |
| `FileStatsEntity` | (implicit) | File usage statistics |
| `AgentEntity` | `agents` | AI agent configurations |
| `GeneratedPostEntity` | (implicit) | AI-generated post drafts |
| `SocialCommentEntity` | `social_comments` | Content comments |
| `PluginContentEntity` | (implicit) | Plugin-initiated content |
| `ContentMetricsEntity` | (implicit) | Engagement metrics |

### Entity Guidelines

* Keep entities persistence-focused.
* Avoid business logic inside entities.
* All entities extend `AuditAware` which provides `createdBy`, `createdAt`, `modifiedBy`, `modifiedAt` via Spring Data auditing.
* Use String IDs (MongoDB ObjectId).

Example:

```java
@Document(collection = "users")
public class UserEntity extends AuditAware {

    @Id
    private String id;

}
```

### Repository Pattern

Every entity uses a **two-layer repository pattern**:

1. **`*MongoRepository`** — Spring Data interface (basic CRUD + simple queries)
2. **`*BaseRepository`** — Custom class wrapping complex logic, implements separate `*ReadDB` and `*WriteDB` interfaces

Example:
```
FileMongoRepository      (extends MongoRepository)
FileBaseRepository       (implements FileReadDB, FileWriteDB)
  └── FileReadDB         (interface for read operations)
  └── FileWriteDB        (interface for write operations)
```

Services inject the `*BaseRepository`, not the `*MongoRepository` directly.

## Security

* Never hardcode secrets.
* Read secrets from environment variables.
* Validate all inputs.
* Sanitize logs.
* Follow OWASP recommendations.

---

## Performance

Before implementing:

1. Consider query count.
2. Avoid N+1 queries.
3. Use pagination.
4. Cache only when justified.

---

## Documentation

When generating code:

* Add JavaDoc for public APIs.
* Explain complex logic.
* Keep comments concise.

---

## When Generating Code

Claude should:

1. Produce complete compilable code.
2. Include imports.
3. Follow existing package structure (`com.avron.socialic`).
4. Prefer maintainability over brevity.
5. Explain architectural decisions when relevant.
6. Generate tests alongside business logic.
7. Avoid introducing unnecessary libraries.
8. Follow project conventions before introducing new patterns.
9. Use `@Slf4j` for logging (Lombok).
10. Use `@RequiredArgsConstructor` with constructor injection only.
11. New exception types go in `exception/` package and must extend `SocialicGlobalException`.
12. New exception messages go in `messages/exception/messages.properties`.
13. New response messages go in `messages/response/messages.properties`.
14. New validators extend `AbstractValidationStrategy` and register in `ValidationStrategyFactory`.

---

## Output Expectations

When asked to implement a feature:

1. Explain the approach.
2. Show affected files.
3. Generate complete code.
4. Include tests.
5. Mention database changes if needed.
6. Mention configuration changes if needed.

Always assume this is a production system.

---

## Decision Log & Task Tracking

All decisions and tasks are tracked in the `ai-dlc/` folder. See [ai-dlc/coding-assistant.md](ai-dlc/coding-assistant.md) for the full workflow.

**Decision logs** — `ai-dlc/decision-logs/dl-{unix_epoch}_{HHMMSS}-{prefix}.log`
**Task files** — `ai-dlc/tasks/task-{unix_epoch}_{HHMMSS}-{prefix}.log`

Every decision log includes: Author, Date, Purpose, Q&A, decisions made, alternatives considered, scope, risks, and acceptance criteria.
Every task file tracks: STATUS (PENDING → IN_PROGRESS → COMPLETE), implementation plan, build verification result, and completion timestamp.