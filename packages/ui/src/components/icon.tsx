import {
	ArrowRightEndOnRectangleIcon,
	ArrowUturnRightIcon,
	BellIcon,
	CheckBadgeIcon,
	ChevronRightIcon,
	ChevronUpDownIcon,
	CreditCardIcon,
	EllipsisHorizontalIcon,
	FolderIcon,
	SparklesIcon,
	TrashIcon,
} from "@heroicons/react/24/outline";

export interface IconProps {
	name: keyof typeof icons;
	className?: string;
}

const icons = {
	chevronRight: ChevronRightIcon,
	arrowRightEndOnRectangle: ArrowRightEndOnRectangleIcon,
	bell: BellIcon,
	checkBadge: CheckBadgeIcon,
	chevronUpDown: ChevronUpDownIcon,
	creditCard: CreditCardIcon,
	sparkles: SparklesIcon,
	folder: FolderIcon,
	arrowUturnRight: ArrowUturnRightIcon,
	ellipsisHorizontal: EllipsisHorizontalIcon,
	trash: TrashIcon,
} as const;

export function Icon(props: IconProps) {
	const { name, className } = props;
	const RadixIcon = icons[name];

	return <RadixIcon className={className} />;
}
