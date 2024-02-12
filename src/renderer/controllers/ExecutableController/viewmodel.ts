import { useExecutable } from "@/renderer/stores/useExecutable";
import { useEffect } from "react";
import { toast } from "react-toastify";

export function useViewModel() {
	const exe = useExecutable();

	useEffect(() => {
		exe.checkClusterctl();
		exe.checkKubectl();
	}, []);

	return {};
}
