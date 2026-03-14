import { GetTodayTasksInputDTO } from "@application/modules/tasks/services/get-today-tasks";
import type z from "zod";

export const getTodayTasksSchema = GetTodayTasksInputDTO;
export type GetTodayTasksSchema = z.infer<typeof getTodayTasksSchema>;
