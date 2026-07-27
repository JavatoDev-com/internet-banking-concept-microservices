"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { processPayment, getPayments } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { UtilityPaymentRequest } from "@/types/banking";
import { Zap, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

const PROVIDERS: Record<number, string> = {
  1: "Electricity",
  2: "Water",
  3: "Internet",
  4: "Gas",
};

const INITIAL_FORM: UtilityPaymentRequest = {
  providerId: 1,
  amount: 0,
  referenceNumber: "",
  account: "",
};

export default function PaymentsPage() {
  const { data: session } = useSession();
  const [form, setForm] = useState<UtilityPaymentRequest>(INITIAL_FORM);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { data: payments, isLoading: listLoading, refetch } = useQuery({
    queryKey: ["payments"],
    queryFn: () => getPayments(session!.accessToken, 0, 20),
    enabled: !!session?.accessToken,
  });

  const mutation = useMutation({
    mutationFn: (body: UtilityPaymentRequest) => processPayment(session!.accessToken, body),
    onSuccess: (data) => {
      setSuccessMsg(`Payment processed! Reference: ${data.referenceNumber}`);
      setErrorMsg(null);
      setForm(INITIAL_FORM);
      refetch();
    },
    onError: (err: Error) => {
      setErrorMsg(err.message);
      setSuccessMsg(null);
    },
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((f) => ({
      ...f,
      [name]: name === "amount" ? parseFloat(value) || 0 : name === "providerId" ? parseInt(value) : value,
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSuccessMsg(null);
    setErrorMsg(null);
    mutation.mutate(form);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Utility Payments</h1>
        <p className="text-sm text-gray-500 mt-1">Pay your utility bills quickly and securely</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <Zap className="w-5 h-5 text-yellow-500" />
            <h2 className="font-semibold text-gray-800">New Payment</h2>
          </div>

          {successMsg && (
            <div className="flex items-start gap-2 bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
              <p className="text-sm text-green-700">{successMsg}</p>
            </div>
          )}
          {errorMsg && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
              <p className="text-sm text-red-700">{errorMsg}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Utility Provider</label>
              <select
                name="providerId"
                value={form.providerId}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
              >
                {Object.entries(PROVIDERS).map(([id, name]) => (
                  <option key={id} value={id}>{name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
              <input
                name="account"
                value={form.account}
                onChange={handleChange}
                required
                placeholder="Your bank account number"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reference Number</label>
              <input
                name="referenceNumber"
                value={form.referenceNumber}
                onChange={handleChange}
                required
                placeholder="Bill reference / meter number"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount (USD)</label>
              <input
                name="amount"
                type="number"
                min="0.01"
                step="0.01"
                value={form.amount || ""}
                onChange={handleChange}
                required
                placeholder="0.00"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {form.amount > 0 && (
              <div className="bg-yellow-50 rounded-lg p-4 text-sm text-yellow-800 space-y-1">
                <p>Provider: <strong>{PROVIDERS[form.providerId]}</strong></p>
                <p>Account: <strong>{form.account}</strong></p>
                <p>Amount: <strong>{formatCurrency(form.amount)}</strong></p>
              </div>
            )}

            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 disabled:bg-brand-300 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              {mutation.isPending ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Processing…</>
              ) : (
                <><Zap className="w-4 h-4" /> Pay Now</>
              )}
            </button>
          </form>
        </div>

        {/* History */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">Payment History</h2>
          </div>
          {listLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-brand-600" />
            </div>
          ) : (
            <div className="divide-y divide-gray-50 max-h-[480px] overflow-y-auto">
              {payments?.content?.length ? (
                payments.content.map((p, i) => (
                  <div key={p.id ?? i} className="px-6 py-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-800">
                        {PROVIDERS[p.providerId] ?? `Provider ${p.providerId}`}
                      </span>
                      <span className="text-sm font-bold text-gray-900">{formatCurrency(p.amount)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">{p.account}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        p.status === "SUCCESS"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}>{p.status}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Ref: {p.referenceNumber}</p>
                  </div>
                ))
              ) : (
                <p className="px-6 py-12 text-center text-gray-400 text-sm">No payments yet.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
