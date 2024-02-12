import { WizardStepProps, useViewModel } from "./viewmodel";

export function WizardStep(props: WizardStepProps) {
	const viewModel = useViewModel(props);
	return viewModel.wizard.currentStepName == props.name ? (
		props.children
	) : (
		<></>
	);
}
