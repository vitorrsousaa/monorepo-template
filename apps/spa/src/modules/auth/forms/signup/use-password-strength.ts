export type PasswordStrengthLevel = "weak" | "fair" | "strong";

export interface PasswordStrength {
	score: number;
	level: PasswordStrengthLevel;
	label: string;
}

const LABELS: Record<PasswordStrengthLevel, string> = {
	weak: "Too short",
	fair: "Fair — add symbols",
	strong: "Strong",
};

export function getPasswordStrength(value: string): PasswordStrength {
	if (!value) {
		return {
			score: 0,
			level: "weak",
			label: "Use at least 8 characters, a number and a symbol",
		};
	}

	let score = 0;
	if (value.length >= 8) score++;
	if (value.length >= 12) score++;
	if (/[0-9]/.test(value) && /[a-zA-Z]/.test(value)) score++;
	if (/[^a-zA-Z0-9]/.test(value)) score++;

	const level: PasswordStrengthLevel =
		score <= 1 ? "weak" : score <= 2 ? "fair" : "strong";
	const label =
		score === 0
			? "Use at least 8 characters, a number and a symbol"
			: LABELS[level];

	return { score, level, label };
}
