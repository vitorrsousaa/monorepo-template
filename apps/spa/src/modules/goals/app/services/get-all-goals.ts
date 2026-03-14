import type { Goal } from "../entities/goal";

/** Stub: returns mock goals. No API endpoint yet. */
export async function getAllGoals(): Promise<Goal[]> {
	return [
		{
			id: "goal-1",
			name: "Juntar R$ 20.000",
			emoji: "💰",
			status: "ativo",
			targetValue: 20000,
			currentValue: 8000,
			unit: "R$",
			deadline: "2026-12-31",
		},
		{
			id: "goal-2",
			name: "Ler 12 livros em 2026",
			emoji: "📚",
			status: "ativo",
			targetValue: 12,
			currentValue: 3,
			unit: "livros",
			deadline: "2026-12-31",
		},
	];
}
