import { GetInboxTodosInputDTO } from "@application/modules/todos/services/get-inbox-todos/dto";
import type z from "zod";

export const getInboxTodosSchema = GetInboxTodosInputDTO;
export type GetInboxTodosSchema = z.infer<typeof getInboxTodosSchema>;
