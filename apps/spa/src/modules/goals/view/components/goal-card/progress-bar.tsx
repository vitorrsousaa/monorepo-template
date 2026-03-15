type ProgressBarProps = {
	value: number;
	max: number;
	color: string;
};

export function ProgressBar({ value, max, color }: ProgressBarProps) {
	const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
	return (
		<div className="h-1.5 bg-border rounded-full overflow-hidden">
			<div
				className="h-full rounded-full transition-all duration-500"
				style={{ width: `${pct}%`, backgroundColor: color }}
			/>
		</div>
	);
}
