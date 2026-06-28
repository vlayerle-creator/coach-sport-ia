import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name, birth_date, sex, height_cm")
    .eq("id", userData.user!.id)
    .single();

  const { data: latestMeasurement } = await supabase
    .from("body_measurements")
    .select("weight_kg, measured_at")
    .eq("user_id", userData.user!.id)
    .order("measured_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const rows: { label: string; value: string }[] = [
    { label: "Prénom", value: profile?.first_name ?? "—" },
    { label: "Date de naissance", value: profile?.birth_date ?? "—" },
    { label: "Sexe physiologique", value: profile?.sex === "male" ? "Homme" : profile?.sex === "female" ? "Femme" : "—" },
    { label: "Taille", value: profile?.height_cm ? `${profile.height_cm} cm` : "—" },
    { label: "Poids le plus récent", value: latestMeasurement?.weight_kg ? `${latestMeasurement.weight_kg} kg` : "—" },
    { label: "E-mail", value: userData.user?.email ?? "—" },
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold tracking-tight">Profil</h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">Informations</CardTitle>
        </CardHeader>
        <CardContent className="divide-y">
          {rows.map((row) => (
            <div key={row.label} className="flex items-center justify-between py-2 text-sm">
              <span className="text-muted-foreground">{row.label}</span>
              <span className="font-medium">{row.value}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
