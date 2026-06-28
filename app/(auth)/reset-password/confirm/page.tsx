import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ConfirmResetForm } from "./confirm-form";

export default function ConfirmResetPasswordPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Nouveau mot de passe</CardTitle>
        <CardDescription>Choisis un mot de passe sécurisé.</CardDescription>
      </CardHeader>
      <CardContent>
        <ConfirmResetForm />
      </CardContent>
    </Card>
  );
}
