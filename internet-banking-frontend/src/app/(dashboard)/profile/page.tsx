"use client";

import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { User, Mail, Hash, ShieldCheck, Loader2 } from "lucide-react";

export default function ProfilePage() {
  const { data: session } = useSession();

  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers(session!.accessToken, 0, 50),
    enabled: !!session?.accessToken,
  });

  const currentUser = users?.find(
    (u) => u.email === session?.user?.email
  ) ?? users?.[0];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="text-sm text-gray-500 mt-1">Your bank account information</p>
      </div>

      {isLoading && (
        <div className="flex items-center gap-2 text-gray-500">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">Loading profile…</span>
        </div>
      )}

      {currentUser && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Avatar card */}
          <div className="bg-gradient-to-br from-brand-700 to-brand-900 rounded-2xl p-6 text-white flex flex-col items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mb-4">
              <User className="w-10 h-10 text-white" />
            </div>
            <p className="font-bold text-lg">{currentUser.email}</p>
            <span className={`mt-2 text-xs px-3 py-1 rounded-full ${
              currentUser.status === "ACTIVE" ? "bg-green-400/20 text-green-300" : "bg-red-400/20 text-red-300"
            }`}>
              {currentUser.status}
            </span>
          </div>

          {/* Details */}
          <div className="md:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-semibold text-gray-800 mb-6">Account Details</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-brand-100 flex items-center justify-center shrink-0">
                  <Hash className="w-5 h-5 text-brand-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">User ID</p>
                  <p className="text-sm font-semibold text-gray-800 mt-0.5">{currentUser.id}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-brand-100 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-brand-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">Email</p>
                  <p className="text-sm font-semibold text-gray-800 mt-0.5">{currentUser.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-brand-100 flex items-center justify-center shrink-0">
                  <Hash className="w-5 h-5 text-brand-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">NIC / Identification</p>
                  <p className="text-sm font-semibold text-gray-800 mt-0.5">{currentUser.identification || "—"}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-brand-100 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 text-brand-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">Auth ID (Keycloak)</p>
                  <p className="text-sm font-mono text-gray-600 mt-0.5 break-all">{currentUser.authId || "—"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* All Users Table (admin view) */}
      {users && users.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">All Bank Users</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                  <th className="px-6 py-3 text-left">ID</th>
                  <th className="px-6 py-3 text-left">Email</th>
                  <th className="px-6 py-3 text-left">Identification</th>
                  <th className="px-6 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-gray-400">#{u.id}</td>
                    <td className="px-6 py-4 font-medium">{u.email}</td>
                    <td className="px-6 py-4 text-gray-500">{u.identification || "—"}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        u.status === "ACTIVE"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}>
                        {u.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
