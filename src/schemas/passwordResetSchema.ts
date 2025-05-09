import { z } from "zod";
import { passwordValidation } from "./signUpSchema";

export const passwordSchema = z
  .object({
    // Apply the same password validation rules to both fields
    password: passwordValidation,
    confirmPassword: passwordValidation,
  })

  // Add a custom refinement to ensure both passwords match
  .refine((data) => data.password === data.confirmPassword, {
    // Error message shown when passwords do not match
    message: "Passwords don't match",

    // Associate the error with the confirmPassword field in the form
    path: ["confirmPassword"],
  });
