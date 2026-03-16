import { useCallback, useState } from "react";

import { Button } from "@repo/ui/button";
import { Dialog, DialogContent } from "@repo/ui/dialog";
import { useCreateProject } from "../../app/hooks/use-create-project";
import { ProjectForm } from "../forms/project";
import type { TProjectFormSchema } from "../forms/project/project-form.schema";

const COLOR_SOLID_MAP: Record<string, string> = {
	"#7F77DD": "#534AB7",
	"#1D9E75": "#0F6E56",
	"#378ADD": "#185FA5",
	"#F0952A": "#A05C00",
	"#A86CC8": "#7A3FA0",
	"#D4537E": "#993556",
	"#1B9E99": "#0D6E6A",
	"#D94848": "#A02020",
	"#888780": "#5F5E5A",
};

interface NewProjectModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export function NewProjectModal({ isOpen, onClose }: NewProjectModalProps) {
	const { createProject } = useCreateProject();

	const [accentColor, setAccentColor] = useState("#7F77DD");

	const solidColor = COLOR_SOLID_MAP[accentColor] ?? "#534AB7";

	const handleColorChange = useCallback((color: string) => {
		setAccentColor(color);
	}, []);

	const handleSubmit = async (data: TProjectFormSchema) => {
		createProject({
			name: data.name,
			description: data.description,
			color: data.color,
		});
		onClose();
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[500px] overflow-hidden border-border bg-card p-0">
				<div className="h-1 w-full" style={{ backgroundColor: accentColor }} />

				<div className="space-y-6 px-7 pb-6 pt-5">
					<div className="flex items-start justify-between gap-4">
						<div>
							<h2 className="text-[17px] font-semibold tracking-tight text-foreground">
								Create New Project
							</h2>
							<p className="mt-1 text-xs text-muted-foreground">
								Add a new project to organize your tasks
							</p>
						</div>
					</div>

					<ProjectForm
						onSubmit={handleSubmit}
						formId="new-project-form"
						onColorChange={handleColorChange}
					/>

					<div className="mt-4 flex justify-end gap-2 border-t border-border/60 pt-4">
						<Button
							type="button"
							variant="outline"
							className="h-9 rounded-lg px-4 text-xs font-medium"
							onClick={onClose}
						>
							Cancel
						</Button>
						<Button
							type="submit"
							className="h-9 rounded-lg px-5 text-xs font-medium text-white hover:opacity-90"
							style={{ backgroundColor: solidColor }}
							form="new-project-form"
						>
							Create Project
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
