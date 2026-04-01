interface DateGroupProps {
	label: string;
}

export function DateGroup({ label }: DateGroupProps) {
	return (
		<div className="flex items-center gap-3 mb-3">
			<p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
				{label}
			</p>
			<div className="flex-1 h-px bg-border" />
		</div>
	);
}
