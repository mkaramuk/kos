import { useModal } from "@/renderer/stores/useModal";
import { ReactNode, useEffect, useState } from "react";
import { useLocation } from "wouter";

export interface TopbarProps {
	children?: ReactNode;
	backLocation?: string;
}

export function useViewModel(props: TopbarProps) {
	const modal = useModal();
	const [location, navigate] = useLocation();
	const [breadcrumb, setBreadcrumb] = useState<string[]>([]);

	function onBackClick() {
		if (props.backLocation) {
			navigate(props.backLocation, { replace: true });
			return;
		}

		const path = location.split("/");
		navigate(path.slice(0, path.length - 1).join("/"), { replace: true });
	}

	useEffect(() => {
		setBreadcrumb(location.split("/"));
	}, [location]);

	return {
		modal,
		location: breadcrumb,
		onBackClick,
		backButtonVisible: location != "/management-clusters",
	};
}
