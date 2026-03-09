/**
 * Task - unidade central do domínio (ação concreta a ser realizada).
 * Fonte de verdade para o módulo tasks.
 * Todo é o legado; novos fluxos usam Task.
 */
export interface Task {
	id: string;
	userId: string;
	projectId?: string | null;
	sectionId?: string | null;
	title: string;
	description: string;
	completed: boolean;
	createdAt: Date;
	updatedAt: Date;
	order?: number;
	completedAt?: Date | null;
	dueDate?: Date | null;
	priority?: "low" | "medium" | "high" | null;
}
