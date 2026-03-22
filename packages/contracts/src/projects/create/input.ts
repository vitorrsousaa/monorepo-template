import type { z } from "zod";
import type { createProjectSchema } from "./schema";

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
