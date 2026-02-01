import { z } from "zod";

export const GetProjectDetailInputDTO = z.object({
	userId: z.string().uuid(),
});

export type GetProjectDetailInput = z.infer<typeof GetProjectDetailInputDTO>;

export interface GetProjectDetailOutput {
	success: boolean;
}
