import { z } from "zod";
import { createProjectSchema } from "./schema";

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
