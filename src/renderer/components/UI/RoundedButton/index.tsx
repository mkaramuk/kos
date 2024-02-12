import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export interface RoundedButtonProps {
	children?: ReactNode;
	onClick?: () => void;
	className?: string;
}

export function RoundedButton(props: RoundedButtonProps) {
	return (
		<button
			className={twMerge(
				"py-2 px-4 gap-3 flex items-center justify-center group hover:bg-blue-200 rounded-full text-white hover:text-black",
				props.className
			)}
			onClick={() => props.onClick?.()}
		>
			{props.children}
		</button>
	);
}
