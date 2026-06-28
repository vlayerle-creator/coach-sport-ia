import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name, onboarding_completed_at")
    .eq("id", userData.user.id)
    .single();

  if (profile?.onboarding_completed_at) redirect("/dashboard");

  return (
    <Card className="max-w-lg">
      <CardHeader>
        <CardTitle>Bienvenue {profile?.first_name ?? ""}</CardTitle>
        <CardDescription>
          Quelques questions pour personnaliser ton coach. Ça prend 3 minutes.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <OnboardingWizard defaultFirstName={profile?.first_name ?? ""} />
      </CardContent>
    </Card>
  );
}
