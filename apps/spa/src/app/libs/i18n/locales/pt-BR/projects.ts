export default {
	form: {
		nameLabel: "Nome do Projeto",
		namePlaceholder: "ex: Trabalho, Pessoal, Saúde...",
		descriptionLabel: "Descrição",
		descriptionOptional: "(opcional)",
		descriptionPlaceholder: "Adicione uma descrição para este projeto...",
		colorLabel: "Cor do Projeto",
		selectedColor: "Cor selecionada:",
		colors: {
			"#7F77DD": "Profissional",
			"#1D9E75": "Casa / Pessoal",
			"#378ADD": "Estudos",
			"#F0952A": "Saúde / Hábitos",
			"#A86CC8": "Pessoal",
			"#D4537E": "Criativo",
			"#1B9E99": "Técnico",
			"#D94848": "Urgente",
			"#888780": "Geral",
		},
	},

	error: {
		title: "Erro ao carregar projeto",
		desc: "Não foi possível carregar este projeto. Verifique sua conexão e tente novamente.",
	},

	allProjects: {
		title: "Todos os projetos",
		count_one: "{{count}} projeto no total",
		count_other: "{{count}} projetos no total",
		newProject: "Novo projeto",
		searchPlaceholder: "Buscar projeto...",
		filters: {
			all: "Todos",
			active: "Ativos",
			completed: "Concluídos",
		},
		status: {
			active: "Ativo",
			completed: "Concluído",
		},
		card: {
			tasksOf: "{{done}} de {{total}} tarefas",
			finished: "Finalizado",
			remaining_one: "{{count}} restante",
			remaining_other: "{{count}} restantes",
			viewProject: "Ver projeto",
			viewActivity: "Ver atividade",
			deleteProject: "Excluir projeto",
			saving: "Salvando...",
			saveFailed: "Falha ao salvar",
			retry: "Tentar novamente",
		},
		empty: {
			title: "Nenhum projeto encontrado",
			filteredDesc: "Tente outro termo de busca ou filtro",
			emptyDesc: "Crie um projeto para começar",
		},
		errorState: {
			title: "Erro ao carregar projetos",
			desc: "Não foi possível carregar seus projetos. Tente novamente.",
			retry: "Tentar novamente",
		},
	},
};
