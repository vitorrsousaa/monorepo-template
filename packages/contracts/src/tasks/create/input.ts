import type { z } from "zod";
import type { createTaskSchema } from "./schema";

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
