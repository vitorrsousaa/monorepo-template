import { Button } from "@repo/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@repo/ui/dialog";
import { Icon } from "@repo/ui/icon";

interface DeleteProjectModalProps {
	isOpen: boolean;
	onClose: () => void;
	projectName: string;
	onConfirm: () => void;
}

export function DeleteProjectModal({
	isOpen,
	onClose,
	projectName,
	onConfirm,
}: DeleteProjectModalProps) {
	const handleConfirm = () => {
		onConfirm();
		onClose();
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<div className="flex items-center gap-3 mb-2">
						<div className="p-2 rounded-full bg-destructive/20">
							<Icon
								name="exclamationTriangle"
								className="w-5 h-5 text-destructive"
							/>
						</div>
						<DialogTitle>Delete Project</DialogTitle>
					</div>
					<DialogDescription>
						Are you sure you want to delete{" "}
						<span className="font-semibold text-foreground">{projectName}</span>
						? This action cannot be undone and all tasks in this project will be
						permanently deleted.
					</DialogDescription>
				</DialogHeader>
				<div className="flex justify-end gap-2 mt-4">
					<Button variant="outline" onClick={onClose}>
						Cancel
					</Button>
					<Button variant="destructive" onClick={handleConfirm}>
						Delete Project
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
