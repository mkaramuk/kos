import { BaseModal } from "@/renderer/components/Modals/BaseModal";
import { WizardProvider } from "@/renderer/contexts/WizardContext";
import { useModal } from "@/renderer/stores/useModal";
import {
	CreateClusterModalProps,
	CreateClusterWizardContext,
	EmptyOption,
} from "./viewmodel";
import { StepSelectProvider } from "@/renderer/components/Modals/CreateClusterModal/Steps/StepSelectProvider";
import { StepDockerCluster } from "@/renderer/components/Modals/CreateClusterModal/Steps/DockerProvider/StepDockerCluster";
import { StepGenerateCluster } from "@/renderer/components/Modals/CreateClusterModal/Steps/StepGenerateCluster";
import { StepFinish } from "@/renderer/components/Modals/CreateClusterModal/Steps/StepFinish";

export function CreateClusterModal(props: CreateClusterModalProps) {
	const modal = useModal();

	return (
		<BaseModal {...props}>
			<div className="w-[500px]">
				<WizardProvider
					defaultValue={
						{
							kubeconfig: props.kubeconfig,
							provider: EmptyOption,
							version: EmptyOption,
							clusterName: "",
							controlPlaneCount: { label: "1", value: 1 },
							workerCount: 1,
							onCancel: () => modal.closeModal(),
							onFinish: props.onFinish,
						} satisfies CreateClusterWizardContext
					}
				>
					<StepSelectProvider name="select-provider" />

					{/* Docker */}
					<StepDockerCluster name="cluster-docker" />

					<StepGenerateCluster name="generate-cluster" />
					<StepFinish name="finish" />
				</WizardProvider>
			</div>
		</BaseModal>
	);
}
