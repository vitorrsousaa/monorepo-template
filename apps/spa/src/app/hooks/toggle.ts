import { useReducer } from "react";

export function useToggle(initialValue = false): [boolean, () => void] {
	const [value, toggle] = useReducer((s: boolean) => !s, initialValue);

	return [value, toggle];
}
