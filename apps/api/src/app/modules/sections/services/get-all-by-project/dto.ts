import { Section } from "@repo/contracts/sections/entities";
export interface GetAllByProjectInput {
	userId: string;
	projectId: string;
}

export interface GetAllByProjectOutput {
	sections: Section[];
	total: number;
}
