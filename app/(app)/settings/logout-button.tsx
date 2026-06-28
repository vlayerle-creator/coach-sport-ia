"use client";

import { Button } from "@/components/ui/button";
import { logout } from "@/lib/actions/auth";

export function LogoutButton() {
  return (
    <Button variant="outline" onClick={() => logout()}>
      Se déconnecter
    </Button>
  );
}
