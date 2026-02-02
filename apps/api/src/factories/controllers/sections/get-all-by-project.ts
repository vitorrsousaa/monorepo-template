import { GetAllByProjectController } from "@application/modules/sections/controllers/get-all-by-project";
import { makeGetAllByProjectService } from "@factories/services/sections/get-all-by-project";

export function makeGetAllByProjectController(): GetAllByProjectController {
	const getAllByProjectService = makeGetAllByProjectService();

	return new GetAllByProjectController(getAllByProjectService);
}
