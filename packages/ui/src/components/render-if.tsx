import type { ReactNode } from "react";

interface RenderIfProps {
	condition: boolean;
	render: ReactNode;
}

export function RenderIf({ condition, render }: RenderIfProps) {
	return condition && render;
}
