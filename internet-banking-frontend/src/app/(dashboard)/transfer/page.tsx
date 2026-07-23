"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { initiateTransfer, getTransfers } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { FundTransferRequest } from "@/types/banking";
import { ArrowRightLeft, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

const INITIAL_FORM: FundTransferRequest = {
  fromAccount: "",
  toAccount: "",
  amount: 0,
  authID: "",
};

export default function TransferPage() {
  const { data: session } = useSession();
  const [form, setForm] = useState<FundTransferRequest>(INITIAL_FORM);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { data: transfers, isLoading: listLoading, refetch } = useQuery({
    queryKey: ["transfers"],
    queryFn: () => getTransfers(session!.accessToken, 0, 20),
    enabled: !!session?.accessToken,
  });

  const mutation = useMutation({
    mutationFn: (body: FundTransferRequest) => initiateTransfer(session!.accessToken, body),
    onSuccess: (data) => {
      setSuccessMsg(`Transfer successful! Reference: ${data.transactionReference}`);
      setErrorMsg(null);
      setForm(INITIAL_FORM);
      refetch();
    },
    onError: (err: Error) => {
      setErrorMsg(err.message);
      setSuccessMsg(null);
    },
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: name === "amount" ? parseFloat(value) || 0 : value }));
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
        <h1 className="text-2xl font-bold text-gray-900">Fund Transfer</h1>
        <p className="text-sm text-gray-500 mt-1">Transfer funds between bank accounts</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <ArrowRightLeft className="w-5 h-5 text-brand-600" />
            <h2 className="font-semibold text-gray-800">New Transfer</h2>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">From Account</label>
              <input
                name="fromAccount"
                value={form.fromAccount}
                onChange={handleChange}
                required
                placeholder="e.g. 100015003000"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To Account</label>
              <input
                name="toAccount"
                value={form.toAccount}
                onChange={handleChange}
                required
                placeholder="e.g. 100015003001"
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Auth ID</label>
              <input
                name="authID"
                value={form.authID}
                onChange={handleChange}
                required
                placeholder="Keycloak user ID"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <p className="text-xs text-gray-400 mt-1">Your Keycloak user identifier</p>
            </div>

            {form.amount > 0 && form.fromAccount && form.toAccount && (
              <div className="bg-brand-50 rounded-lg p-4 text-sm text-brand-800 space-y-1">
                <p>From: <strong>{form.fromAccount}</strong></p>
                <p>To: <strong>{form.toAccount}</strong></p>
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
                <><ArrowRightLeft className="w-4 h-4" /> Transfer Funds</>
              )}
            </button>
          </form>
        </div>

        {/* History */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">Transfer History</h2>
          </div>
          {listLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-brand-600" />
            </div>
          ) : (
            <div className="divide-y divide-gray-50 max-h-[480px] overflow-y-auto">
              {transfers?.content?.length ? (
                transfers.content.map((t) => (
                  <div key={t.id} className="px-6 py-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-800">
                        {t.fromAccount} → {t.toAccount}
                      </span>
                      <span className="text-sm font-bold text-gray-900">{formatCurrency(t.amount)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400 font-mono">{t.transactionReference}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        t.status === "SUCCESS"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}>{t.status}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{formatDate(t.createdAt)}</p>
                  </div>
                ))
              ) : (
                <p className="px-6 py-12 text-center text-gray-400 text-sm">No transfers yet.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
