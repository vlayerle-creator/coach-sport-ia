"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  resetPasswordRequestSchema,
  type ResetPasswordRequestInput,
} from "@/lib/validations/auth";
import { requestPasswordReset } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function ResetPasswordForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordRequestInput>({ resolver: zodResolver(resetPasswordRequestSchema) });

  const onSubmit = async (data: ResetPasswordRequestInput) => {
    setServerError(null);
    const result = await requestPasswordReset(data);
    if (result?.error) {
      setServerError(result.error);
    } else {
      setSent(true);
    }
  };

  if (sent) {
    return (
      <Alert>
        <AlertDescription>
          Si un compte existe avec cette adresse, un e-mail de réinitialisation vient
          d&apos;être envoyé.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {serverError && (
        <Alert variant="destructive">
          <AlertDescription>{serverError}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input id="email" type="email" autoComplete="email" {...register("email")} />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
        {isSubmitting ? "Envoi..." : "Envoyer le lien de réinitialisation"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        <Link href="/login" className="hover:underline">
          Retour à la connexion
        </Link>
      </p>
    </form>
  );
}
