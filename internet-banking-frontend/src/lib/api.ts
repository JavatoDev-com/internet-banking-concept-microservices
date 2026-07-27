import type {
  BankAccount,
  BankUser,
  FundTransfer,
  FundTransferRequest,
  PageResponse,
  UtilityPayment,
  UtilityPaymentRequest,
} from "@/types/banking";

const GATEWAY = process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:8082";

function headers(token: string): HeadersInit {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

// ── User Service ──────────────────────────────────────────────────────────────

export async function getUsers(token: string, page = 0, size = 10): Promise<BankUser[]> {
  const res = await fetch(
    `${GATEWAY}/user/api/v1/bank-users?page=${page}&size=${size}`,
    { headers: headers(token) }
  );
  return handleResponse<BankUser[]>(res);
}

export async function getUserById(token: string, id: number): Promise<BankUser> {
  const res = await fetch(`${GATEWAY}/user/api/v1/bank-users/${id}`, {
    headers: headers(token),
  });
  return handleResponse<BankUser>(res);
}

// ── Core Banking ──────────────────────────────────────────────────────────────

export async function getBankAccount(token: string, accountNumber: string): Promise<BankAccount> {
  const res = await fetch(
    `${GATEWAY}/core/api/v1/account/bank-account/${accountNumber}`,
    { headers: headers(token) }
  );
  return handleResponse<BankAccount>(res);
}

// ── Fund Transfer Service ─────────────────────────────────────────────────────

export async function initiateTransfer(
  token: string,
  body: FundTransferRequest
): Promise<FundTransfer> {
  const res = await fetch(`${GATEWAY}/fund-transfer/api/v1/transfer`, {
    method: "POST",
    headers: headers(token),
    body: JSON.stringify(body),
  });
  return handleResponse<FundTransfer>(res);
}

export async function getTransfers(
  token: string,
  page = 0,
  size = 10
): Promise<PageResponse<FundTransfer>> {
  const res = await fetch(
    `${GATEWAY}/fund-transfer/api/v1/transfer?page=${page}&size=${size}`,
    { headers: headers(token) }
  );
  return handleResponse<PageResponse<FundTransfer>>(res);
}

// ── Utility Payment Service ───────────────────────────────────────────────────

export async function processPayment(
  token: string,
  body: UtilityPaymentRequest
): Promise<UtilityPayment> {
  const res = await fetch(`${GATEWAY}/payment/api/v1/utility-payment`, {
    method: "POST",
    headers: headers(token),
    body: JSON.stringify(body),
  });
  return handleResponse<UtilityPayment>(res);
}

export async function getPayments(
  token: string,
  page = 0,
  size = 10
): Promise<PageResponse<UtilityPayment>> {
  const res = await fetch(
    `${GATEWAY}/payment/api/v1/utility-payment?page=${page}&size=${size}`,
    { headers: headers(token) }
  );
  return handleResponse<PageResponse<UtilityPayment>>(res);
}
