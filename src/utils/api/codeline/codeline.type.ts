import type { z } from "zod";
import type { userSchema } from "./codeline.dto";

export type User = z.infer<typeof userSchema>;