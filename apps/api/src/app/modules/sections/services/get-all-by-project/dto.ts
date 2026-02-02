import type { Section } from "@core/domain/section/section";
import { z } from "zod";

export const GetAllByProjectInputDTO = z.object({
	userId: z.string().uuid(),
	projectId: z.string().uuid(),
});

export type GetAllByProjectInput = z.infer<typeof GetAllByProjectInputDTO>;

export interface GetAllByProjectOutput {
	sections: Section[];
	total: number;
}
