import { Infrastructure } from "@/main/models/Infrastructure";
import { BaseModalProps } from "@/renderer/components/Modals/BaseModal/viewmodel";

type OnFinishHandler = (context: AddManagementClusterWizardContext) => void;

export interface Provider {
	stepName?: string;
	name: Infrastructure;
	metadata: any;
	envVariables?: any;
}

export interface AddManagementClusterWizardContext {
	kubeconfig: string;
	clusterName: string;
	kubeconfigFilename?: string;
	isConnecting: boolean;
	providers: Provider[];
	onFinish?: OnFinishHandler;
	onCancel?: () => void;
}

export interface AddManagementClusterModalProps extends BaseModalProps {
	onFinish?: OnFinishHandler;
}
