# API Contracts — Next.js Frontend MVP

File: `api-contract-1784790245_123405-nextjs-frontend-mvp.md`
Session: 2026-07-23 12:34
Related DL: `dl-1784790245_123405-nextjs-frontend-mvp.log`

> All requests route through the API Gateway at `http://localhost:8082`.
> Replace `{{token}}` with a valid Keycloak JWT access token.

---

## 1. Keycloak — Obtain Access Token

```bash
curl --location 'http://localhost:8080/realms/javatodev-internet-banking/protocol/openid-connect/token' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'grant_type=password' \
--data-urlencode 'client_id=internet-banking-core-client' \
--data-urlencode 'client_secret=0efd3e37-258e-4488-96ae-1dfe34679c9d' \
--data-urlencode 'username=ib_admin@javatodev.com' \
--data-urlencode 'password=5V7huE3G86uB'
```

**Response `200 OK`:**
```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIs...",
  "expires_in": 300,
  "token_type": "Bearer"
}
```

---

## 2. User Service — List Bank Users

`GET /user/api/v1/bank-users`

```bash
curl --location 'http://localhost:8082/user/api/v1/bank-users?page=0&size=10' \
--header 'Authorization: Bearer {{token}}'
```

**Response `200 OK`:**
```json
[
  {
    "id": 1,
    "email": "ib_admin@javatodev.com",
    "identification": "NIC123456",
    "authId": "uuid-from-keycloak",
    "status": "ACTIVE"
  }
]
```

---

## 3. User Service — Get User by ID

`GET /user/api/v1/bank-users/{id}`

```bash
curl --location 'http://localhost:8082/user/api/v1/bank-users/1' \
--header 'Authorization: Bearer {{token}}'
```

---

## 4. Core Banking — Get Bank Account

`GET /core/api/v1/account/bank-account/{accountNumber}`

```bash
curl --location 'http://localhost:8082/core/api/v1/account/bank-account/100015003000' \
--header 'Authorization: Bearer {{token}}'
```

**Response `200 OK`:**
```json
{
  "id": 1,
  "number": "100015003000",
  "type": "SAVINGS",
  "status": "ACTIVE",
  "availableBalance": 25000.00,
  "actualBalance": 25000.00,
  "user": {
    "id": 1,
    "email": "ib_admin@javatodev.com"
  }
}
```

---

## 5. Fund Transfer — Initiate Transfer

`POST /fund-transfer/api/v1/transfer`

```bash
curl --location 'http://localhost:8082/fund-transfer/api/v1/transfer' \
--header 'Authorization: Bearer {{token}}' \
--header 'Content-Type: application/json' \
--data '{
  "fromAccount": "100015003000",
  "toAccount": "100015003001",
  "amount": 500.00,
  "authID": "keycloak-user-uuid"
}'
```

**Response `200 OK`:**
```json
{
  "id": 1,
  "transactionReference": "TXN-uuid",
  "status": "SUCCESS",
  "fromAccount": "100015003000",
  "toAccount": "100015003001",
  "amount": 500.00
}
```

---

## 6. Fund Transfer — List Transfers

`GET /fund-transfer/api/v1/transfer`

```bash
curl --location 'http://localhost:8082/fund-transfer/api/v1/transfer?page=0&size=10' \
--header 'Authorization: Bearer {{token}}'
```

**Response `200 OK`:**
```json
{
  "content": [...],
  "totalElements": 5,
  "totalPages": 1,
  "size": 10,
  "number": 0
}
```

---

## 7. Utility Payment — Process Payment

`POST /payment/api/v1/utility-payment`

```bash
curl --location 'http://localhost:8082/payment/api/v1/utility-payment' \
--header 'Authorization: Bearer {{token}}' \
--header 'Content-Type: application/json' \
--data '{
  "providerId": 1,
  "amount": 75.00,
  "referenceNumber": "ELEC-REF-123",
  "account": "100015003000"
}'
```

**Response `200 OK`:**
```json
{
  "providerId": 1,
  "amount": 75.00,
  "referenceNumber": "ELEC-REF-123",
  "account": "100015003000",
  "status": "SUCCESS"
}
```

---

## 8. Utility Payment — List Payments

`GET /payment/api/v1/utility-payment`

```bash
curl --location 'http://localhost:8082/payment/api/v1/utility-payment?page=0&size=10' \
--header 'Authorization: Bearer {{token}}'
```

---

## CORS Update — API Gateway

The `SecurityConfiguration.java` in `internet-banking-api-gateway` was updated to allow
`http://localhost:3000` (the Next.js dev server). This is a code-level change (not YAML) and
applies in both local and Docker environments.

Allowed origins: `http://localhost:3000`
Allowed methods: `GET, POST, PUT, PATCH, DELETE, OPTIONS`
Allowed credentials: `true`
