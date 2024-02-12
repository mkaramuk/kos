import { previousProviderConfig } from "@/renderer/components/Modals/AddManagementClusterModal/Steps/InfrastructureConfig/viewmodel-shared";
import { AddManagementClusterWizardContext } from "@/renderer/components/Modals/AddManagementClusterModal/viewmodel";
import { TextField } from "@/renderer/components/UI/TextField";
import { WizardButtons } from "@/renderer/components/Wizard/WizardButtons";
import { WizardStep } from "@/renderer/components/Wizard/WizardStep";
import { useWizard } from "@/renderer/hooks/useWizard";
import { useModal } from "@/renderer/stores/useModal";
import { toast } from "react-toastify";

export function StepFinish(props: any) {
	const wizard = useWizard<AddManagementClusterWizardContext>();
	const modal = useModal();

	function onClusterNameChange(
		event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) {
		wizard.setData((data) => ({
			...data,
			clusterName: event.target.value,
		}));
	}

	async function onFinish() {
		await toast.promise(
			electron.capi.addManagementCluster(
				wizard.data.kubeconfig,
				wizard.data.clusterName
			),
			{
				pending: {
					render() {
						return (
							<div>{wizard.data.clusterName} is saving...</div>
						);
					},
				},
				error: {
					render(props) {
						return <div>{(props.data as Error).message}</div>;
					},
				},
			}
		);
		wizard.data.onFinish?.(wizard.data);
		modal.closeModal();
	}

	function onBackClick() {
		if (wizard.data.providers.length == 0) {
			wizard.goToStep(0);
		} else {
			previousProviderConfig(
				wizard.data.providers[wizard.data.providers.length - 1].name,
				wizard
			);
		}
	}

	return (
		<WizardStep
			onLoad={() => {
				// If there are not any providers, that is mean
				// the cluster is already initialized. So we can
				// go back to change kubeconfig. Otherwise
				// we initialized cluster so we cannot go back.
				wizard.changePreviousEnable(wizard.data.providers.length == 0);
				wizard.changeNextEnable(true);
			}}
			{...props}
		>
			<div className="w-full flex flex-col gap-3">
				<h1 className="text-[20px] font-bold">Enter a name</h1>
				<hr />
				<p>
					Enter a name for management cluster (default context name
					used):
				</p>
				<TextField
					value={wizard.data.clusterName}
					onChange={onClusterNameChange}
				/>

				<WizardButtons
					onNextClick={onFinish}
					onBackClick={onBackClick}
					cancelButton
					onCancelClick={wizard.data.onCancel}
				/>
			</div>
		</WizardStep>
	);
}
