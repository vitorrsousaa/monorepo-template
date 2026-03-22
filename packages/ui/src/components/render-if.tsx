import type { ReactNode } from "react";

interface RenderIfProps {
	condition: boolean;
	render: ReactNode;
	fallback?: ReactNode;
}

export function RenderIf({
	condition,
	render,
	fallback = null,
}: RenderIfProps) {
	return condition ? render : fallback;
}
