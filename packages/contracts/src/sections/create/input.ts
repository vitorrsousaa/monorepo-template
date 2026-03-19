import type { z } from "zod";
import type { createSectionSchema } from "./schema";

export type CreateSectionInput = z.infer<typeof createSectionSchema>;
