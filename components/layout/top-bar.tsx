import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export function TopBar({ firstName }: { firstName: string }) {
  const initial = firstName.charAt(0).toUpperCase() || "?";

  return (
    <header className="flex items-center justify-between border-b px-4 py-3 md:px-6">
      <div className="text-sm text-muted-foreground">
        Bonjour, <span className="font-medium text-foreground">{firstName}</span>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="size-5" />
        </Button>
        <ThemeToggle />
        <Avatar className="size-8">
          <AvatarFallback>{initial}</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
