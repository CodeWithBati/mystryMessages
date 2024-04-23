import { z } from "zod";

export const SignInSchema = z.object({
  indetifier: z.string(),
  password: z.string(),
});
