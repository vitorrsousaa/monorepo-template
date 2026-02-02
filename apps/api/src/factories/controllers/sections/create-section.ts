import { CreateSectionController } from "@application/modules/sections/controllers/create-section";
import { makeCreateSectionService } from "@factories/services/sections/create-section";

export function makeCreateSectionController(): CreateSectionController {
	const createSectionService = makeCreateSectionService();

	return new CreateSectionController(createSectionService);
}
