import { ReactNode, useEffect, useRef } from "react";

export interface BaseModalProps {
	children?: ReactNode;
	onClose?: () => void;
}

export function useViewModel(props: BaseModalProps) {
	const ref = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		function handleOnClose(event: MouseEvent) {
			if (ref.current && !ref.current.contains(event.target as Node)) {
				props.onClose?.();
			}
		}

		document.addEventListener("mousedown", handleOnClose);
		return () => document.removeEventListener("mousedown", handleOnClose);
	}, [ref]);

	return {
		ref,
	};
}
