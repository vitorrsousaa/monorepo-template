import { useGetProjectDetail } from "@/modules/projects/app/hooks/use-get-project-detail";
import { useCreateSection } from "@/modules/sections/app/hooks/use-create-section";
import { useCallback, useReducer, useState } from "react";
import { useParams } from "react-router-dom";

export function useProjectHook() {
	const { id } = useParams();
	const projectId = id ?? "";

	const [openInputToAddSection, toggleInputToAddSection] = useReducer(
		(state) => !state,
		false,
	);
	const [newSectionName, setNewSectionName] = useState("");

	const {
		projectDetail,
		isErrorProjectDetail,
		isFetchingProjectDetail,
		refetchProjectDetail,
	} = useGetProjectDetail({ projectId });

	const { createSection } = useCreateSection();

	const handleAddSection = useCallback(() => {
		if (newSectionName.trim()) {
			setNewSectionName("");
			const lastOrder = projectDetail?.sections?.reduce(
				(max, section) => Math.max(max, section?.order ?? 0),
				0,
			);

			createSection({
				projectId,
				name: newSectionName,
				order: lastOrder ? lastOrder + 1 : undefined,
			});
			toggleInputToAddSection();
		}
	}, [newSectionName, createSection, projectId, projectDetail?.sections]);

	const handleCloseInputToAddSection = useCallback(() => {
		setNewSectionName("");
		toggleInputToAddSection();
	}, []);

	const handleChangeInputToAddSection = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			setNewSectionName(event.target.value);
		},
		[],
	);

	const handleKeyDownInputToAddSection = useCallback(
		(event: React.KeyboardEvent<HTMLInputElement>) => {
			if (event.key === "Enter") {
				handleAddSection();
			}
			if (event.key === "Escape") {
				setNewSectionName("");
				toggleInputToAddSection();
			}
		},
		[handleAddSection],
	);

	return {
		projectId,
		projectDetail,
		isErrorProjectDetail,
		isFetchingProjectDetail,
		openInputToAddSection,
		newSectionName,
		refetchProjectDetail,
		handleAddSection,
		toggleInputToAddSection,
		handleCloseInputToAddSection,
		handleKeyDownInputToAddSection,
		handleChangeInputToAddSection,
	};
}
