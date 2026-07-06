import { createClient } from "@/lib/supabase/server";
import { CoachChat } from "@/components/coach/chat";

export default async function CoachPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: conv } = await supabase
    .from("ai_conversations")
    .select("id, ai_messages(role, content, created_at)")
    .eq("user_id", user!.id)
    .order("updated_at", { ascending: false })
    .limit(1)
    .single();

  const messages = (conv?.ai_messages ?? [])
    .filter((m: any) => m.role === "user" || m.role === "assistant")
    .sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    .map((m: any) => ({ role: m.role as "user" | "assistant", content: m.content }));

  return (
    <div className="flex flex-col h-full pb-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">Coach IA</h1>
          <p className="text-xs text-muted-foreground">Ton coach connaît ton profil complet</p>
        </div>
      </div>

      <CoachChat
        initialMessages={messages}
        conversationId={conv?.id ?? null}
      />
    </div>
  );
}
