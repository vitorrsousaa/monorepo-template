import { z } from "zod";

export const CreateSectionInputDTO = z.object({
	userId: z.string().uuid(),
	projectId: z.string().uuid(),
	name: z.string().min(1),
	order: z.number().int().positive().optional(),
});

export type CreateSectionInput = z.infer<typeof CreateSectionInputDTO>;

export interface CreateSectionOutput {
	section: {
		id: string;
		name: string;
		order: number;
		createdAt: Date;
		updatedAt: Date;
	};
}
