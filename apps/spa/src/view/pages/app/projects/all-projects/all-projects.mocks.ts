/**
 * Mocks para a view Todos os Projetos.
 * Alinhado com o domínio: Project com status, Tasks com projectId.
 */

export const MOCK_USER_ID = "aaaaaaaa-bbbb-4ccc-d000-000000000000" as const;

export type AllProjectsTask = {
	id: string;
	title: string;
	description?: string;
	status: "concluida" | "pendente";
	projectId: string;
	userId: string;
};

export type AllProjectsProject = {
	id: string;
	name: string;
	description?: string;
	emoji: string;
	color: string;
	status: "ativo" | "concluido" | "arquivado";
	deadline?: string;
	userId: string;
};

export const ALL_PROJECTS_TASKS_MOCK: AllProjectsTask[] = [
	{
		id: "ap-t1",
		title: "Revisar PR",
		status: "concluida",
		projectId: "ap-1",
		userId: MOCK_USER_ID,
	},
	{
		id: "ap-t2",
		title: "Daily standup",
		status: "concluida",
		projectId: "ap-1",
		userId: MOCK_USER_ID,
	},
	{
		id: "ap-t3",
		title: "Implementar endpoint",
		status: "pendente",
		projectId: "ap-1",
		userId: MOCK_USER_ID,
	},
	{
		id: "ap-t4",
		title: "Configurar CI/CD",
		status: "pendente",
		projectId: "ap-1",
		userId: MOCK_USER_ID,
	},
	{
		id: "ap-t5",
		title: "Comprar ração",
		status: "pendente",
		projectId: "ap-2",
		userId: MOCK_USER_ID,
	},
	{
		id: "ap-t6",
		title: "Limpar quintal",
		status: "concluida",
		projectId: "ap-2",
		userId: MOCK_USER_ID,
	},
	{
		id: "ap-t7",
		title: "Practice English",
		status: "pendente",
		projectId: "ap-3",
		userId: MOCK_USER_ID,
	},
	{
		id: "ap-t8",
		title: "Ler capítulo 3",
		status: "concluida",
		projectId: "ap-3",
		userId: MOCK_USER_ID,
	},
	{
		id: "ap-t9",
		title: "Meditação",
		status: "concluida",
		projectId: "ap-3",
		userId: MOCK_USER_ID,
	},
	{
		id: "ap-t10",
		title: "Pagar fatura",
		status: "pendente",
		projectId: "ap-4",
		userId: MOCK_USER_ID,
	},
	{
		id: "ap-t11",
		title: "Investir R$ 500",
		status: "concluida",
		projectId: "ap-4",
		userId: MOCK_USER_ID,
	},
	{
		id: "ap-t12",
		title: "Cancelar assinatura",
		status: "concluida",
		projectId: "ap-4",
		userId: MOCK_USER_ID,
	},
	{
		id: "ap-t13",
		title: "Finalizar documentação",
		status: "concluida",
		projectId: "ap-5",
		userId: MOCK_USER_ID,
	},
	{
		id: "ap-t14",
		title: "Deploy produção",
		status: "concluida",
		projectId: "ap-5",
		userId: MOCK_USER_ID,
	},
	{
		id: "ap-t15",
		title: "Organizar arquivos",
		status: "concluida",
		projectId: "ap-6",
		userId: MOCK_USER_ID,
	},
];

export const ALL_PROJECTS_MOCK: AllProjectsProject[] = [
	{
		id: "ap-1",
		name: "Profissional",
		description: "Tarefas do trabalho e desenvolvimento",
		emoji: "💼",
		color: "#3b82f6",
		status: "ativo",
		deadline: "2026-06-30",
		userId: MOCK_USER_ID,
	},
	{
		id: "ap-2",
		name: "Casa",
		description: "Tarefas domésticas e compras",
		emoji: "🏠",
		color: "#22c55e",
		status: "ativo",
		userId: MOCK_USER_ID,
	},
	{
		id: "ap-3",
		name: "Estudos",
		description: "Inglês e aprendizado contínuo",
		emoji: "🎓",
		color: "#8b5cf6",
		status: "ativo",
		deadline: "2026-12-31",
		userId: MOCK_USER_ID,
	},
	{
		id: "ap-4",
		name: "Pessoal",
		description: "Saúde, hábitos e finanças",
		emoji: "😊",
		color: "#f59e0b",
		status: "ativo",
		userId: MOCK_USER_ID,
	},
	{
		id: "ap-5",
		name: "App LifeOS v1",
		description: "MVP do aplicativo de produtividade",
		emoji: "🚀",
		color: "#ec4899",
		status: "concluido",
		deadline: "2026-03-01",
		userId: MOCK_USER_ID,
	},
	{
		id: "ap-6",
		name: "Migração 2024",
		description: "Projeto antigo arquivado",
		emoji: "📦",
		color: "#6b7280",
		status: "arquivado",
		userId: MOCK_USER_ID,
	},
];
