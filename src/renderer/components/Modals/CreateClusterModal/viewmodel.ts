import { BaseModalProps } from "@/renderer/components/Modals/BaseModal/viewmodel";

type OnFinishHandler = (context: CreateClusterWizardContext) => void;

export interface Option {
	value?: any;
	label?: string;
}

export const EmptyOption: Option = { value: "", label: "" };

export interface CreateClusterWizardContext {
	clusterName: string;
	provider: Option;
	version: Option;
	kubeconfig: string;
	controlPlaneCount: Option;
	workerCount: number;
	onFinish?: OnFinishHandler;
	onCancel?: () => void;
}

export interface CreateClusterModalProps extends BaseModalProps {
	clusterName: string;
	kubeconfig: string;
	onFinish?: OnFinishHandler;
}
