import { z } from "zod";

export const GetAllProjectsByUserInputDTO = z.object({
	userId: z.string().uuid(),
});

export type GetAllProjectsByUserInput = z.infer<
	typeof GetAllProjectsByUserInputDTO
>;

export interface GetAllProjectsByUserOutput {
	success: boolean;
}
