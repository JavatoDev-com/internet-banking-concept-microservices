export interface BankUser {
  id: number;
  email: string;
  identification: string;
  authId: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BankAccount {
  id: number;
  number: string;
  type: string;
  status: string;
  availableBalance: number;
  actualBalance: number;
  user: BankUser;
}

export interface Transaction {
  id: number;
  amount: number;
  referenceNumber: string;
  bankAccount: BankAccount;
}

export interface FundTransfer {
  id: number;
  transactionReference: string;
  status: string;
  fromAccount: string;
  toAccount: string;
  amount: number;
  createdAt?: string;
}

export interface UtilityPayment {
  id?: number;
  providerId: number;
  amount: number;
  referenceNumber: string;
  account: string;
  status: string;
  createdAt?: string;
}

export interface FundTransferRequest {
  fromAccount: string;
  toAccount: string;
  amount: number;
  authID: string;
}

export interface UtilityPaymentRequest {
  providerId: number;
  amount: number;
  referenceNumber: string;
  account: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface ApiError {
  code: string;
  message: string;
}
