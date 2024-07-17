import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(2, "Minimum 2 charecters")
  .max(20, "Max 20 checters allowed")
  .regex(/^[a-zA-Z0-9_]+$/, "Don't use Space and special charecters");

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z
    .string()
    .regex(
      /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/g,
      "Invalid email"
    ),
  firstname: z.string().min(2, "Minimum 2 charecters"),
  middname: z.optional(z.string()),
  lastname: z.string().min(2, "Minimum 2 charecters"),
  phonenumber: z
    .string()
    .regex(
      /^\+?(\d{1,4})?[-.\s]?(\(?\d{1,4}\)?)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/,
      "Invalid phone number"
    ),
  password: z.string().min(6, "Minimum 6 charecters"),
});
