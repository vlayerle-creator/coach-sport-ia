import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProgramForm } from "./program-form";

export default function NewProgramPage() {
  return (
    <div className="max-w-lg mx-auto space-y-4">
      <div className="flex items-center gap-2">
        <Link href="/training" className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}>
          <ChevronLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-xl font-bold">Nouveau programme</h1>
      </div>
      <Card>
        <CardContent className="pt-6">
          <ProgramForm />
        </CardContent>
      </Card>
    </div>
  );
}
