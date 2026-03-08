import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { useState } from "react";

type EditValueModalProps = {
	goalId: string;
	currentValue: number;
	targetValue: number;
	unit?: string;
	onSave: (goalId: string, value: number) => void;
	onClose: () => void;
};

export function EditValueModal({
	goalId,
	currentValue,
	targetValue,
	unit,
	onSave,
	onClose,
}: EditValueModalProps) {
	const [value, setValue] = useState(String(currentValue));

	const handleSave = () => {
		const num = parseFloat(value);
		if (!Number.isNaN(num)) {
			onSave(goalId, num);
		}
		onClose();
	};

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
			onClick={onClose}
			onKeyDown={(e) => e.key === "Escape" && onClose()}
			role="button"
			tabIndex={0}
			aria-label="Fechar modal"
		>
			<div
				className="bg-card border border-border rounded-xl p-5 w-72 shadow-xl space-y-4"
				onClick={(e) => e.stopPropagation()}
				onKeyDown={(e) => e.stopPropagation()}
			>
				<p className="font-semibold text-foreground text-sm">
					Atualizar progresso
				</p>
				<div className="flex items-center gap-2">
					<Input
						type="number"
						className="flex-1 bg-background border-border"
						value={value}
						onChange={(e) => setValue(e.target.value)}
						autoFocus
					/>
					{unit && (
						<span className="text-sm text-muted-foreground shrink-0">
							{unit}
						</span>
					)}
				</div>
				<p className="text-xs text-muted-foreground">
					Meta: {targetValue} {unit}
				</p>
				<div className="flex gap-2 justify-end">
					<Button size="sm" variant="outline" onClick={onClose}>
						Cancelar
					</Button>
					<Button size="sm" onClick={handleSave}>
						Salvar
					</Button>
				</div>
			</div>
		</div>
	);
}
