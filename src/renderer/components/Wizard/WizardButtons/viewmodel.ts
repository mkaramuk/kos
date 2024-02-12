import { useWizard } from "@/renderer/hooks/useWizard";
import { ReactNode } from "react";

export interface WizardButtonsProps {
	cancelButton?: boolean;
	cancelEnabled?: boolean;
	nextButtonLabel?: ReactNode;
	onNextClick?: () => void;
	onBackClick?: () => void;
	onCancelClick?: () => void;
}

export function useViewModel(props: WizardButtonsProps) {
	const wizard = useWizard<any>();

	function onBackClick() {
		if (props.onBackClick) {
			props.onBackClick();
		} else {
			wizard.previousStep();
		}
	}

	function onNextClick() {
		if (props.onNextClick) {
			props.onNextClick();
		} else {
			wizard.nextStep();
		}
	}

	return {
		wizard,
		onBackClick,
		onNextClick,
	};
}
