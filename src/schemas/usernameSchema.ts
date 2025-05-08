import { z } from "zod";
import { usernameValidation } from "./signUpSchema";

export const usernameSchema = z.object({
  username: usernameValidation,
});
