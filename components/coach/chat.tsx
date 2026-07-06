"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { toast } from "sonner";
import { Send, RefreshCw, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { sendCoachMessage } from "@/lib/actions/coach";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
  created_at?: string;
}

const SUGGESTIONS = [
  "Comment je progresse vers mon objectif ?",
  "Que dois-je manger avant ma séance ?",
  "J'ai des courbatures, je m'entraîne quand même ?",
  "Optimise mon programme cette semaine",
  "Analyse ma nutrition de cette semaine",
];

function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === "user";
  return (
    <div className={cn("flex gap-2.5 items-start", isUser && "flex-row-reverse")}>
      <div className={cn(
        "shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold",
        isUser ? "bg-primary text-primary-foreground" : "bg-muted"
      )}>
        {isUser ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
      </div>
      <div className={cn(
        "rounded-2xl px-4 py-3 text-sm max-w-[82%] whitespace-pre-wrap leading-relaxed",
        isUser
          ? "bg-primary text-primary-foreground rounded-tr-sm"
          : "bg-muted rounded-tl-sm"
      )}>
        {msg.content}
      </div>
    </div>
  );
}

export function CoachChat({ initialMessages, conversationId }: {
  initialMessages: Message[];
  conversationId: string | null;
}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [convId, setConvId] = useState<string | null>(conversationId);
  const [pending, startTransition] = useTransition();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, pending]);

  function send(text: string) {
    const msg = text.trim();
    if (!msg || pending) return;
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: msg }]);

    startTransition(async () => {
      const result = await sendCoachMessage(convId, msg);
      if (result.error) {
        toast.error(result.error);
        setMessages(prev => prev.slice(0, -1));
        return;
      }
      if (result.conversation_id && !convId) setConvId(result.conversation_id);
      setMessages(prev => [...prev, { role: "assistant", content: result.reply }]);
    });
  }

  function handleKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] min-h-0">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 py-2 px-1">
        {messages.length === 0 && (
          <div className="text-center py-10 space-y-3">
            <div className="text-4xl">🤖</div>
            <p className="font-semibold">Ton coach IA personnel</p>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
              Je connais ton profil, tes séances, ta nutrition et tes progrès. Pose-moi n'importe quelle question.
            </p>
            <div className="flex flex-wrap gap-2 justify-center pt-2">
              {SUGGESTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-xs border rounded-full px-3 py-1.5 hover:bg-muted transition-colors text-left"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <MessageBubble key={i} msg={msg} />
        ))}

        {pending && (
          <div className="flex gap-2.5 items-start">
            <div className="shrink-0 w-7 h-7 rounded-full bg-muted flex items-center justify-center">
              <Bot className="h-3.5 w-3.5" />
            </div>
            <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3">
              <RefreshCw className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t pt-3 pb-1 flex gap-2 items-end">
        <Textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Pose une question à ton coach…"
          rows={2}
          className="resize-none text-sm flex-1"
          disabled={pending}
        />
        <Button
          size="icon"
          onClick={() => send(input)}
          disabled={pending || !input.trim()}
          className="shrink-0 h-10 w-10"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
      <p className="text-[10px] text-muted-foreground text-center pb-1">
        Entrée pour envoyer · Maj+Entrée pour nouvelle ligne
      </p>
    </div>
  );
}
