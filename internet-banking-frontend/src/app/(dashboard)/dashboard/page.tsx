"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { getBankAccount, getTransfers } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  CreditCard,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Loader2,
  AlertCircle,
} from "lucide-react";

export default function DashboardPage() {
  const { data: session } = useSession();
  const [accountNumber, setAccountNumber] = useState("100015003000");
  const [queryAccount, setQueryAccount] = useState("100015003000");

  const { data: account, isLoading: accountLoading, error: accountError, refetch: refetchAccount } = useQuery({
    queryKey: ["account", queryAccount],
    queryFn: () => getBankAccount(session!.accessToken, queryAccount),
    enabled: !!session?.accessToken && !!queryAccount,
  });

  const { data: transfers, isLoading: transfersLoading } = useQuery({
    queryKey: ["transfers"],
    queryFn: () => getTransfers(session!.accessToken, 0, 10),
    enabled: !!session?.accessToken,
  });

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setQueryAccount(accountNumber);
    refetchAccount();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Overview of your banking activity</p>
      </div>

      {/* Account Lookup */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          placeholder="Enter account number"
          className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
        <button
          type="submit"
          className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Search className="w-4 h-4" />
          Look up
        </button>
      </form>

      {/* Balance Cards */}
      {accountLoading && (
        <div className="flex items-center gap-2 text-gray-500">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">Loading account…</span>
        </div>
      )}
      {accountError && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 rounded-lg p-4">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">Account not found or access denied.</span>
        </div>
      )}
      {account && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-brand-600 to-brand-800 rounded-2xl p-6 text-white col-span-1 md:col-span-1">
            <div className="flex items-center justify-between mb-4">
              <span className="text-brand-200 text-sm font-medium">Available Balance</span>
              <CreditCard className="w-5 h-5 text-brand-200" />
            </div>
            <p className="text-3xl font-bold">{formatCurrency(account.availableBalance)}</p>
            <p className="text-brand-200 text-sm mt-2">Account #{account.number}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-500 text-sm font-medium">Actual Balance</span>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(account.actualBalance)}</p>
            <p className="text-gray-400 text-xs mt-2">{account.type} account</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-500 text-sm font-medium">Account Status</span>
              <div className={`w-2 h-2 rounded-full ${account.status === "ACTIVE" ? "bg-green-500" : "bg-red-500"}`} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{account.status}</p>
            <p className="text-gray-400 text-xs mt-2">{account.user?.email}</p>
          </div>
        </div>
      )}

      {/* Recent Transfers */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">Recent Fund Transfers</h2>
        </div>
        {transfersLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-brand-600" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                  <th className="px-6 py-3 text-left">Reference</th>
                  <th className="px-6 py-3 text-left">From</th>
                  <th className="px-6 py-3 text-left">To</th>
                  <th className="px-6 py-3 text-right">Amount</th>
                  <th className="px-6 py-3 text-center">Status</th>
                  <th className="px-6 py-3 text-left">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {transfers?.content?.length ? (
                  transfers.content.map((t) => (
                    <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-gray-500">{t.transactionReference}</td>
                      <td className="px-6 py-4">{t.fromAccount}</td>
                      <td className="px-6 py-4">{t.toAccount}</td>
                      <td className="px-6 py-4 text-right font-semibold">
                        <span className="flex items-center justify-end gap-1">
                          <ArrowUpRight className="w-3 h-3 text-red-500" />
                          {formatCurrency(t.amount)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          t.status === "SUCCESS"
                            ? "bg-green-100 text-green-700"
                            : t.status === "FAILED"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}>
                          {t.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-400">{formatDate(t.createdAt)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                      No transfers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
