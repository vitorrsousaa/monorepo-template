import type { IService } from "@application/interfaces/service";
import type { IPermissionService } from "@data/protocols/sharing/permission-service";
import type { ITasksRepository } from "@data/protocols/tasks/tasks-repository";
import type { CreateTasksInputService, CreateTasksOutputService } from "./dto";

export interface ICreateTasksService
	extends IService<CreateTasksInputService, CreateTasksOutputService> {}

export class CreateTasksService implements ICreateTasksService {
	constructor(
		private readonly taskRepository: ITasksRepository,
		private readonly permissionService?: IPermissionService,
	) {}

	async execute(
		input: CreateTasksInputService,
	): Promise<CreateTasksOutputService> {
		let ownerUserId = input.userId;
		if (this.permissionService && input.projectId) {
			const result = await this.permissionService.requireRole({
				requesterId: input.userId,
				resourceType: "project",
				resourceId: input.projectId,
				requiredRole: "editor",
			});
			ownerUserId = result.ownerUserId;
		}

		const task = await this.taskRepository.create({
			userId: ownerUserId,
			title: input.title,
			description: input.description ?? null,
			priority: input.priority ?? null,
			dueDate: input.dueDate ?? null,
			projectId: input.projectId ?? null,
			sectionId: input.sectionId ?? null,
			recurrence: input.recurrence ?? null,
			nextTaskId: null,
		});
		return { task };
	}
}
