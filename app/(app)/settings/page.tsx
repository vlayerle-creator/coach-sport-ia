import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { LogoutButton } from "./logout-button";

export default function SettingsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold tracking-tight">Paramètres</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">Apparence</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <span className="text-sm">Mode clair / sombre</span>
          <ThemeToggle />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">Compte</CardTitle>
          <CardDescription>
            Les unités, notifications, export et suppression de compte arriveront en phase 7.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Separator className="mb-4" />
          <LogoutButton />
        </CardContent>
      </Card>
    </div>
  );
}
