import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(3, "Username must be atleast 2 characters")
  .max(20, "Username must be atmost 20 characters")
  .regex(/^[a-zA-Z0-9]+$/, "Username must be alphanumeric");

  export const SignupSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message:'Invalid Email Address'}),
    password: z.string().min(6, {message:'Password must me atleast 6 characters'}) 
  })