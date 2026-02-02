import { createSection as createSectionService } from "@/modules/sections/app/services/create-section";
import { useMutation } from "@tanstack/react-query";

export function useCreateSection() {
	const { mutate: createSection } = useMutation({
		mutationFn: createSectionService,
		// onSuccess: async (_data, variables) => {
		// 	await queryClient.invalidateQueries({
		// 		queryKey: QUERY_KEYS.PROJECTS.DETAIL(variables.projectId),
		// 	});
		// },
	});

	return { createSection };
}
