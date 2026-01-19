import {
	ArrowRightEndOnRectangleIcon,
	ArrowUturnRightIcon,
	BellIcon,
	CalendarIcon,
	CheckBadgeIcon,
	ChevronRightIcon,
	ChevronUpDownIcon,
	CreditCardIcon,
	EllipsisHorizontalIcon,
	ExclamationTriangleIcon,
	FireIcon,
	FlagIcon,
	FolderIcon,
	InboxIcon,
	SparklesIcon,
	TagIcon,
	TrashIcon,
	XMarkIcon,
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
	fire: FireIcon,
	exclamationTriangle: ExclamationTriangleIcon,
	calendar: CalendarIcon,
	inbox: InboxIcon,
	tag: TagIcon,
	flag: FlagIcon,
	x: XMarkIcon,
} as const;

export function Icon(props: IconProps) {
	const { name, className } = props;
	const RadixIcon = icons[name];

	return <RadixIcon className={className} />;
}
