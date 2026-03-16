import { createTasks as createTasksService } from "@/modules/tasks/app/services/create-tasks";
import { useMutation } from "@tanstack/react-query";


export function useCreateTasks() {

	const { mutate: createTasks } = useMutation({
		mutationFn: createTasksService,
		
	});

	return { createTasks };
}
