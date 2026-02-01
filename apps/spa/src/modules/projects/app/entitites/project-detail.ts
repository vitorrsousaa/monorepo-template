import type { SectionWithTodos } from "@/modules/sections/app/entities/section-with-todos";
import type { Project } from "./project";

export type ProjectDetail = {
	project: Project;
	sections: SectionWithTodos[];
};
