"use client";

import { useSession, signOut } from "next-auth/react";
import { LogOut, User, Bell } from "lucide-react";

export function Header() {
  const { data: session } = useSession();

  return (
    <header className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between shrink-0">
      <div />

      <div className="flex items-center gap-3">
        <button className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
          <Bell className="w-4 h-4 text-gray-500" />
        </button>

        <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
          <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center">
            <User className="w-4 h-4 text-brand-600" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-gray-800 leading-tight">
              {session?.user?.name ?? session?.user?.email ?? "User"}
            </p>
            <p className="text-xs text-gray-400">{session?.user?.email}</p>
          </div>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-red-600 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Sign out</span>
        </button>
      </div>
    </header>
  );
}
