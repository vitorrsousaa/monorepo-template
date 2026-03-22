type ProgressRingProps = {
	value: number;
	max: number;
	size?: number;
	color?: string;
};

export function ProgressRing({
	value,
	max,
	size = 60,
	color = "#7C3AED",
}: ProgressRingProps) {
	const pct = max > 0 ? Math.min(value / max, 1) : 0;
	const r = (size - 8) / 2;
	const circ = 2 * Math.PI * r;
	const dash = circ * pct;
	const percentLabel = `${Math.round(pct * 100)}%`;

	return (
		<svg
			width={size}
			height={size}
			className="shrink-0 -rotate-90"
			role="img"
			aria-label={`Progress: ${percentLabel}`}
		>
			<title>{percentLabel} progress</title>
			<circle
				cx={size / 2}
				cy={size / 2}
				r={r}
				fill="none"
				stroke="var(--border)"
				strokeWidth={5}
			/>
			<circle
				cx={size / 2}
				cy={size / 2}
				r={r}
				fill="none"
				stroke={color}
				strokeWidth={5}
				strokeDasharray={`${dash} ${circ - dash}`}
				strokeLinecap="round"
				style={{ transition: "stroke-dasharray 0.5s ease" }}
			/>
		</svg>
	);
}
