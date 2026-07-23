"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Building2, Lock, Shield } from "lucide-react";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [status, router]);

  async function handleSignIn() {
    setLoading(true);
    await signIn("keycloak", { callbackUrl: "/dashboard" });
  }

  if (status === "loading" || status === "authenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-900 to-brand-700">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-950 to-brand-800 p-4">
      <div className="w-full max-w-md">
        {/* Logo + Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/10 backdrop-blur mb-4">
            <Building2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Internet Banking</h1>
          <p className="text-brand-200 mt-1">Secure. Fast. Reliable.</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Welcome back</h2>
          <p className="text-sm text-gray-500 mb-8">
            Sign in with your bank credentials to access your account.
          </p>

          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 text-sm text-gray-600">
              <Lock className="w-4 h-4 text-brand-600 shrink-0" />
              256-bit SSL encryption
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 text-sm text-gray-600">
              <Shield className="w-4 h-4 text-brand-600 shrink-0" />
              Multi-factor authentication via Keycloak
            </div>
          </div>

          <button
            onClick={handleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 disabled:bg-brand-300 text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-200"
          >
            {loading ? (
              <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
            ) : (
              <Building2 className="w-5 h-5" />
            )}
            {loading ? "Redirecting…" : "Sign in with Bank SSO"}
          </button>

          <p className="text-xs text-center text-gray-400 mt-6">
            By signing in you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
