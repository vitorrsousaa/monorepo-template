import { z } from "zod";
import { createTaskSchema } from "./schema";

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
