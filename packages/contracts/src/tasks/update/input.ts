import type { z } from "zod";
import type { updateTaskSchema } from "./schema";

export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
