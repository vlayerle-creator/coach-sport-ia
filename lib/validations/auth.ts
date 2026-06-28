import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Adresse e-mail invalide"),
  password: z.string().min(8, "8 caractères minimum"),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const signupSchema = z.object({
  firstName: z.string().min(1, "Prénom requis").max(60),
  email: z.string().email("Adresse e-mail invalide"),
  password: z.string().min(8, "8 caractères minimum"),
});
export type SignupInput = z.infer<typeof signupSchema>;

export const resetPasswordRequestSchema = z.object({
  email: z.string().email("Adresse e-mail invalide"),
});
export type ResetPasswordRequestInput = z.infer<typeof resetPasswordRequestSchema>;

export const resetPasswordConfirmSchema = z
  .object({
    password: z.string().min(8, "8 caractères minimum"),
    confirmPassword: z.string().min(8, "8 caractères minimum"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });
export type ResetPasswordConfirmInput = z.infer<typeof resetPasswordConfirmSchema>;
