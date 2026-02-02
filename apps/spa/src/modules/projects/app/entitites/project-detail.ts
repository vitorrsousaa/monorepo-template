import type { SectionWithTodos } from "@/modules/sections/app/entities/section-with-todos";
import type { Todo } from "@/modules/todo/app/entities/todo";
import type { Project } from "./project";

export type ProjectDetail = {
	project: Project;
	sections: SectionWithTodos[];
	/** Todos that belong to this project but have no section assigned */
	todosWithoutSection: Todo[];
};
