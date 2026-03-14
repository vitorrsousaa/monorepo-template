import { GetAllByProjectInputDTO } from "@application/modules/sections/services/get-all-by-project/dto";
import type z from "zod";

export const getAllByProjectSchema = GetAllByProjectInputDTO;
export type GetAllByProjectSchema = z.infer<typeof getAllByProjectSchema>;
