import type { Todo } from "@core/domain/todo/todo";
import { z } from "zod";

export const CreateTodoInputDTO = z.object({
  title: z
    .string()
    .min(1, "Título não pode ser vazio")
    .max(100, "Título deve ter no máximo 100 caracteres"),

  description: z
    .string()
    .min(1, "Descrição não pode ser vazia")
    .max(500, "Descrição deve ter no máximo 500 caracteres"),
});

export type CreateTodoInput = z.infer<typeof CreateTodoInputDTO>;

export interface CreateTodoOutput {
  todo: Todo;
}
