import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoginForm } from "./login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ confirmEmail?: string }>;
}) {
  const { confirmEmail } = await searchParams;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connexion</CardTitle>
        <CardDescription>Accède à ton coach personnel.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {confirmEmail && (
          <Alert>
            <AlertDescription>
              Compte créé ! Vérifie ta boîte mail pour confirmer ton adresse avant de te
              connecter.
            </AlertDescription>
          </Alert>
        )}
        <LoginForm />
      </CardContent>
    </Card>
  );
}
