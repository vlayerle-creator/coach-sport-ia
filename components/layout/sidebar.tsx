"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { PRIMARY_NAV, SECONDARY_NAV } from "@/lib/constants/nav";
import { Separator } from "@/components/ui/separator";

function NavLink({ href, label, icon: Icon }: { href: string; label: string; icon: typeof PRIMARY_NAV[number]["icon"] }) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      <Icon className="size-4" />
      {label}
    </Link>
  );
}

export function Sidebar() {
  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r px-3 py-6 md:flex">
      <div className="px-3 pb-6 text-lg font-semibold tracking-tight">Coach Sport IA</div>
      <nav className="flex flex-1 flex-col gap-1">
        {PRIMARY_NAV.map((item) => (
          <NavLink key={item.href} {...item} />
        ))}
        <Separator className="my-3" />
        {SECONDARY_NAV.map((item) => (
          <NavLink key={item.href} {...item} />
        ))}
      </nav>
    </aside>
  );
}
