import { useWizard } from "@/renderer/hooks/useWizard";
import { ReactNode, useEffect } from "react";

export interface WizardStepProps {
	name?: string;
	children?: ReactNode;
	onLoad?: () => void;
}

export function useViewModel(props: WizardStepProps) {
	const wizard = useWizard<any>();

	useEffect(() => {
		if (wizard.currentStepName == props.name) {
			props.onLoad?.();
		}
	}, [wizard.currentStepName]);

	return {
		wizard,
	};
}
