"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, LayoutDashboard, ArrowRightLeft, Zap, User } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard",  label: "Dashboard",          icon: LayoutDashboard },
  { href: "/transfer",   label: "Fund Transfer",       icon: ArrowRightLeft },
  { href: "/payments",   label: "Utility Payments",    icon: Zap },
  { href: "/profile",    label: "Profile",             icon: User },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 bg-brand-950 flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-brand-800">
        <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center">
          <Building2 className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-white font-bold text-sm leading-tight">Internet Banking</p>
          <p className="text-brand-400 text-xs">Secure Platform</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                active
                  ? "bg-brand-700 text-white"
                  : "text-brand-300 hover:bg-brand-800 hover:text-white"
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-brand-800">
        <p className="text-brand-500 text-xs text-center">© 2026 Internet Banking</p>
      </div>
    </aside>
  );
}
