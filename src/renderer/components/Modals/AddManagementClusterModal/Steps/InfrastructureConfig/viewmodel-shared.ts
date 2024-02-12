import { AddManagementClusterWizardContext } from "@/renderer/components/Modals/AddManagementClusterModal/viewmodel";
import { WizardContextType } from "@/renderer/contexts/WizardContext";

export async function nextProviderConfig(
	currentProviderName: string,
	wizard: WizardContextType<AddManagementClusterWizardContext>
) {
	const index = wizard.data.providers.findIndex(
		(x: any) => x.name == currentProviderName
	);
	for (let i = index + 1; i < wizard.data.providers.length; i++) {
		const stepName = wizard.data.providers[i].stepName;
		if (stepName) {
			await wizard.goToNamedStep(stepName);
			return;
		}
	}
	await wizard.goToNamedStep("initialize");
}

export async function previousProviderConfig(
	currentProviderName: string,
	wizard: WizardContextType<AddManagementClusterWizardContext>
) {
	const index = wizard.data.providers.findIndex(
		(x: any) => x.name == currentProviderName
	);
	for (let i = index - 1; i >= 0; i--) {
		const stepName = wizard.data.providers[i].stepName;
		if (stepName) {
			await wizard.goToNamedStep(stepName);
			return;
		}
	}
	await wizard.goToNamedStep("select-infrastructures");
}
