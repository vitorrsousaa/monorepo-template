import type { z } from "zod";
import type { updateTaskCompletionSchema } from "./schema";

export type UpdateTaskCompletionInput = z.infer<typeof updateTaskCompletionSchema>;
