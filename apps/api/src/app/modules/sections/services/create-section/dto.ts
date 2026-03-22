import type { CreateSectionInput } from "@repo/contracts/sections/create";
import { Section } from "@repo/contracts/sections/entities";

export interface CreateSectionServiceInput extends CreateSectionInput {
	userId: string;
	projectId: string;
}

export interface CreateSectionServiceOutput {
	section: Section;
}
