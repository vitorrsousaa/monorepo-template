import type { Todo } from "@/modules/todo/app/entities/todo";
import type { Section } from "./section";

export interface SectionWithTodos extends Section {
	todos: Todo[];
}
