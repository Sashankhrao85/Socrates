"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { MessageCircle, BarChart3, Home } from "lucide-react";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/chat", label: "Chat", icon: MessageCircle },
  { href: "/analytics", label: "Insights", icon: BarChart3 },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 border-r border-border bg-sidebar flex flex-col h-screen shrink-0">
      <div className="p-4 border-b border-border">
        <h1 className="text-lg font-bold tracking-tight">Socrates</h1>
        <p className="text-xs text-muted-foreground">Learn by questioning</p>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              )}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-border">
        <p className="text-xs text-muted-foreground">
          The unexamined life is not worth living.
        </p>
      </div>
    </aside>
  );
}
