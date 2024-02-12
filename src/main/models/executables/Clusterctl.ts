import { Infrastructure } from "../Infrastructure";

export type GenerateClusterOptions = {
	name: string;
	kubernetesVersion: string;
	controlPlaneCount: number;
	workerCount: number;
	infrastructure: Infrastructure;
	region?: string;
	sshKeyName?: string;
	controlPlaneMachineType?: string;
	workerMachineType?: string;
};
