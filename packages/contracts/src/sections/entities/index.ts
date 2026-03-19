import { Task } from "../../tasks/entities";

export interface Section {
	id: string;
	userId: string;
	projectId: string;
	name: string;
	order: number;
	deletedAt?: string | null;
	createdAt: string;
	updatedAt: string;
}

export interface SectionsWithTasks extends Section { 
	tasks: Task[];
}