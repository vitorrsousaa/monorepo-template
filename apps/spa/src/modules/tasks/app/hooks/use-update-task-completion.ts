import { updateTaskCompletion } from "@/modules/tasks/app/services/update-task-completion";
import { useMutation } from "@tanstack/react-query";

export function useUpdateTaskCompletion() {
	const { mutate: toggleTaskCompletion } = useMutation({
		mutationFn: updateTaskCompletion,
	});

	return { toggleTaskCompletion };
}
