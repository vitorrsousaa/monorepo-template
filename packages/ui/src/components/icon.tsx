import { ChevronRightIcon } from "@heroicons/react/24/outline";

export interface IconProps {
	name: keyof typeof icons;
	className?: string;
}

const icons = {
	chevronRight: ChevronRightIcon,
} as const;

export function Icon(props: IconProps) {
	const { name, className } = props;
	const RadixIcon = icons[name];

	return <RadixIcon className={className} />;
}
