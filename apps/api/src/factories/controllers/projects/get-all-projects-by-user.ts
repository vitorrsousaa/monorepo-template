import { GetAllProjectsByUserController } from "@application/modules/projects/controllers/get-all-projects-by-user";
import { makeGetAllProjectsByUserService } from "@factories/services/projects/get-all-projects-by-user";

export function makeGetAllProjectsByUserController(): GetAllProjectsByUserController {
	const getAllProjectsByUserService = makeGetAllProjectsByUserService();

	return new GetAllProjectsByUserController(getAllProjectsByUserService);
}
