import { CreateClusterWizardContext } from "@/renderer/components/Modals/CreateClusterModal/viewmodel";
import { WizardButtons } from "@/renderer/components/Wizard/WizardButtons";
import { WizardStep } from "@/renderer/components/Wizard/WizardStep";
import { useWizard } from "@/renderer/hooks/useWizard";
import { useModal } from "@/renderer/stores/useModal";

export function StepFinish(props: any) {
	const modal = useModal();
	const wizard = useWizard<CreateClusterWizardContext>();

	function onLoad() {
		wizard.changeNextEnable(true);
		wizard.changePreviousEnable(false);
	}

	function onNextClick() {
		wizard.data.onFinish?.(wizard.data);
		modal.closeModal();
	}

	return (
		<WizardStep {...props} onLoad={onLoad}>
			<div className="w-full flex flex-col gap-3">
				<h1 className="text-[20px] font-bold">Finish</h1>
				<hr />
				<p>
					Your cluster <b>{wizard.data.clusterName}</b> was created
					successfully. You can track the readiness of the cluster
					using the cluster list. After the cluster is ready, remember
					to install a CNI plugin before you start using it.
				</p>
				<WizardButtons onNextClick={onNextClick} />
			</div>
		</WizardStep>
	);
}
