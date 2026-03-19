import type { CreateSectionInput } from "@repo/contracts/sections/create";
import type { Section } from "@core/domain/section/section";

export interface CreateSectionServiceInput extends CreateSectionInput {
	userId: string;
	projectId: string;
}

export interface CreateSectionServiceOutput {
	section: Section;
}
