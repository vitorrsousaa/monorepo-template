import { z } from "zod";

export const CreateProjectInputDTO = z.object({
	userId: z.string().uuid(),
	name: z.string(),
	description: z.string().optional(),
});

export type CreateProjectInput = z.infer<typeof CreateProjectInputDTO>;

export interface CreateProjectOutput {
	project: {
		id: string;
		name: string;
		description?: string;
		createdAt: Date;
		updatedAt: Date;
	};
}
