import type { Todo } from "@core/domain/todo/todo";
import { z } from "zod";

export const GetInboxTodosInputDTO = z.object({
	userId: z.string().uuid(),
});

export type GetInboxTodosInput = z.infer<typeof GetInboxTodosInputDTO>;

export interface GetInboxTodosOutput {
	todos: Todo[];
	total: number;
}
