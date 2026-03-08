/**
 * Representa um Project em modo objetivo (Goal).
 * Domínio: Project e Goal são a mesma entidade.
 */
export type GoalStatus = "ativo" | "concluido" | "arquivado";

export type Goal = {
	id: string;
	name: string;
	description?: string;
	emoji: string;
	color?: string;
	status: GoalStatus;

	/** Progresso baseado em targetValue (manual) ou tarefas do projeto */
	targetValue?: number;
	currentValue?: number;
	unit?: string;
	deadline?: string;

	/** Quando tem targetValue: progresso = currentValue/targetValue */
	/** Quando não tem: progresso = tasksCompleted/tasksTotal */
};

export type GoalProgress = {
	current: number;
	total: number;
	pct: number;
	label: string;
};
