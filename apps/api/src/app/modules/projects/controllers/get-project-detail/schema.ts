import { GetProjectDetailInputDTO } from "@application/modules/projects/services/get-project-detail/dto";
import type z from "zod";

export const getProjectDetailSchema = GetProjectDetailInputDTO;
export type GetProjectDetailSchema = z.infer<typeof getProjectDetailSchema>;
