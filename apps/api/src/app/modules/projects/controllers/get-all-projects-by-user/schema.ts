import { GetAllProjectsByUserInputDTO } from "@application/modules/projects/services/get-all-projects-by-user/dto";
import z from "zod";

export const getAllProjectsByUserSchema = GetAllProjectsByUserInputDTO;

export type GetAllProjectsByUserSchema = z.infer<typeof getAllProjectsByUserSchema>;