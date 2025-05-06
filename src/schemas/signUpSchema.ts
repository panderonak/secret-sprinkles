import { z } from "zod";

const USERNAME_REGEX = /^[A-Za-z][A-Za-z0-9_-]{1,18}[A-Za-z0-9]$/;
const EMAIL_REGEX =
  /^[a-zA-Z0-9!#$%&'*+\-/=?^_`{|}~]+(\.[a-zA-Z0-9!#$%&'*+\-/=?^_`{|}~]+)*@[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)+$/;
const PASSWORD_REGEX =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d_@$!%*?&]{8,64}$/;

export const usernameValidation = z
  .string()
  .min(3, { message: "Username must be at least 3 characters." })
  .max(20, { message: "Username cannot exceed 20 characters." })
  .regex(USERNAME_REGEX, {
    message:
      "Username must start with a letter and use only letters, numbers, underscores, or hyphens.",
  });

export const passwordValidation = z
  .string()
  .min(8, { message: "Password must be at least 8 characters." })
  .max(64, { message: "Password cannot exceed 64 characters." })
  .regex(PASSWORD_REGEX, {
    message:
      "Password must include an uppercase letter, a lowercase letter, a number, and a special character (@$!%*?&).",
  });

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z
    .string()
    .regex(EMAIL_REGEX, { message: "Please enter a valid email address." }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." })
    .max(64, { message: "Password cannot exceed 64 characters." })
    .regex(PASSWORD_REGEX, {
      message:
        "Password must include an uppercase letter, a lowercase letter, a number, and a special character (@$!%*?&).",
    }),
});
