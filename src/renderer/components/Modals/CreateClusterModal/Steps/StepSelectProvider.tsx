import { Infrastructure } from "@/main/models/Infrastructure";
import {
	CreateClusterWizardContext,
	Option,
} from "@/renderer/components/Modals/CreateClusterModal/viewmodel";
import { WizardButtons } from "@/renderer/components/Wizard/WizardButtons";
import { WizardStep } from "@/renderer/components/Wizard/WizardStep";
import { useWizard } from "@/renderer/hooks/useWizard";
import { InfrastructureLabel } from "@/renderer/models/InfrastructureLabel.enum";
import { useState } from "react";
import Select from "react-select";

export function StepSelectProvider(props: any) {
	const [providers, setProviders] = useState<Option[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const wizard = useWizard<CreateClusterWizardContext>();

	function checkConditions(conditions: any[]): boolean {
		for (const condition of conditions) {
			if (condition.status != "True") {
				return false;
			}
		}
		return true;
	}

	async function onLoad() {
		await wizard.changePreviousEnable(false);
		if (providers.length == 0) {
			await wizard.changeNextEnable(false);
			await setLoading(true);
			const namespaces = await electron.kubectl.get(
				wizard.data.kubeconfig,
				{ resource: "ns" }
			);

			const supportedProviders: Option[] = [];

			for (const ns of namespaces.items) {
				switch (ns.metadata.name) {
					case "capd-system":
						const capdController = await electron.kubectl.get(
							wizard.data.kubeconfig,
							{
								resource: "deployment",
								name: "capd-controller-manager",
								flags: {
									namespace: "capd-system",
								},
							}
						);

						// If the controller is not available, we cannot use
						// that provider.
						if (checkConditions(capdController.status.conditions)) {
							supportedProviders.push({
								label: InfrastructureLabel.docker,
								value: Infrastructure.Docker,
							});
						}
						break;
					case "capg-system":
						const capgController = await electron.kubectl.get(
							wizard.data.kubeconfig,
							{
								resource: "deployment",
								name: "capg-controller-manager",
								flags: {
									namespace: "capg-system",
								},
							}
						);

						if (checkConditions(capgController.status.conditions)) {
							supportedProviders.push({
								label: InfrastructureLabel.gcp,
								value: Infrastructure.GoogleCloudPlatform,
							});
						}
						break;
					case "capa-system":
						const capaController = await electron.kubectl.get(
							wizard.data.kubeconfig,
							{
								resource: "deployment",
								name: "capa-controller-manager",
								flags: {
									namespace: "capa-system",
								},
							}
						);

						if (checkConditions(capaController.status.conditions)) {
							supportedProviders.push({
								label: "AWS",
								value: "aws",
							});
						}
						break;
				}
			}

			await setProviders(supportedProviders);
			await setLoading(false);

			await wizard.changeNextEnable(true);
			await wizard.setData((data) => ({
				...data,
				provider: supportedProviders[0],
			}));
		}
	}

	function nextStep() {
		wizard.goToNamedStep(`cluster-${wizard.data.provider.value}`);
	}

	function onProviderChange(value: Option) {
		wizard.setData((data) => ({ ...data, provider: value }));
	}

	return (
		<WizardStep {...props} onLoad={onLoad}>
			<div className="w-full flex flex-col gap-3">
				<h1 className="text-[20px] font-bold">Select provider</h1>
				<hr />
				<p>
					Select the infrastructure provider for the cluster to be
					created
				</p>
				<Select
					isSearchable={false}
					options={providers}
					isLoading={loading}
					value={wizard.data.provider}
					onChange={onProviderChange}
				/>
				<WizardButtons
					cancelButton
					onNextClick={nextStep}
					onCancelClick={wizard.data.onCancel}
				/>
			</div>
		</WizardStep>
	);
}
