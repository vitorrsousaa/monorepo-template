import { useMutation } from "@tanstack/react-query";
import { createProject as createProjectService } from "../services/create-project";

export function useCreateProject() {
	const { mutate: createProject } = useMutation({
		mutationFn: createProjectService,
	});

	return { createProject };
}
