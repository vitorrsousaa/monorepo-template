export default {
	title: "Configurações",
	subtitle: "Notificações, segurança, assinatura e preferências",

	tabs: {
		notifications: "Notificações",
		security: "Segurança",
		subscription: "Assinatura",
		preferences: "Preferências",
	},

	notifications: {
		channels: "Canais",
		emailNotifs: "Notificações por email",
		emailNotifsDesc: "Receba atualizações no seu email",
		pushNotifs: "Notificações push",
		pushNotifsDesc: "Notificações no navegador",
		events: "Eventos",
		taskDue: "Vencimento de tarefas",
		taskDueDesc: "Alertas quando uma tarefa está prestes a vencer",
		goalUpdates: "Atualização de metas",
		goalUpdatesDesc: "Acompanhamento do progresso de metas",
		weeklySummary: "Resumo semanal",
		weeklySummaryDesc: "Resumo de produtividade toda segunda-feira",
	},

	security: {
		changePassword: "Alterar senha",
		currentPassword: "Senha atual",
		newPassword: "Nova senha",
		confirmPassword: "Confirmar nova senha",
		updatePassword: "Atualizar senha",
		additionalSecurity: "Segurança adicional",
		twoFactor: "Autenticação em dois fatores",
		twoFactorDesc: "Adicione uma camada extra de segurança",
		enable2FA: "Ativar 2FA",
		activeSessions: "Sessões ativas",
		activeSessionsDesc: "1 dispositivo logado",
		manage: "Gerenciar",
	},

	subscription: {
		currentPlan: "Plano atual",
		freePlan: "Plano Free",
		freePlanDesc: "Projetos ilimitados, até 5 metas",
		upgrade: "Fazer upgrade",
		availablePlans: "Planos disponíveis",
		subscribe: "Assinar",
		plans: {
			pro: {
				name: "Pro",
				price: "R$ 19/mês",
				features: ["Metas ilimitadas", "Integrações", "Suporte prioritário"],
			},
			family: {
				name: "Família",
				price: "R$ 39/mês",
				features: ["5 usuários", "Agenda compartilhada", "Tudo do Pro"],
			},
		},
	},

	preferences: {
		theme: "Tema",
		themeLight: "Claro",
		themeDark: "Escuro",
		themeSystem: "Sistema",
		language: "Idioma",
		privacy: "Privacidade",
		usageAnalytics: "Análises de uso",
		usageAnalyticsDesc:
			"Ajude a melhorar o LifeOS compartilhando dados anônimos",
		dangerZone: "Zona de perigo",
		deleteAccount: "Excluir conta",
		deleteAccountDesc:
			"Esta ação é permanente e não pode ser desfeita. Todos os seus dados serão removidos.",
	},
};
