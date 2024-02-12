import { StepConfigurationGcp } from "@/renderer/components/Modals/AddManagementClusterModal/Steps/InfrastructureConfig/StepConfigurationGcp";
import { StepFinish } from "@/renderer/components/Modals/AddManagementClusterModal/Steps/StepFinish";
import { StepInitialize } from "@/renderer/components/Modals/AddManagementClusterModal/Steps/StepInitialize";
import { StepKubeconfigUpload } from "@/renderer/components/Modals/AddManagementClusterModal/Steps/StepKubeconfigUpload";
import { StepSelectInfrastructures } from "@/renderer/components/Modals/AddManagementClusterModal/Steps/StepSelectInfrastructures";
import {
	AddManagementClusterModalProps,
	AddManagementClusterWizardContext,
} from "@/renderer/components/Modals/AddManagementClusterModal/viewmodel";
import { BaseModal } from "@/renderer/components/Modals/BaseModal";
import { WizardProvider } from "@/renderer/contexts/WizardContext";
import { useModal } from "@/renderer/stores/useModal";

export function AddManagementClusterModal(
	props: AddManagementClusterModalProps
) {
	const modal = useModal();

	return (
		<BaseModal {...props}>
			<div className="w-[400px]">
				<WizardProvider
					defaultValue={
						{
							clusterName: "",
							kubeconfig: "",
							isConnecting: false,
							providers: [],
							onCancel: () => modal.closeModal(),
							onFinish: props.onFinish,
						} satisfies AddManagementClusterWizardContext
					}
				>
					<StepKubeconfigUpload />

					{/* Steps for initialize the cluster as management cluster */}
					<StepSelectInfrastructures name="select-infrastructures" />
					<StepConfigurationGcp name="configuration-gcp" />
					<StepInitialize name="initialize" />

					<StepFinish name="finish" />
				</WizardProvider>
			</div>
		</BaseModal>
	);
}
