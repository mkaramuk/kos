import { useComponentDidMount } from "@/renderer/hooks/useComponentDidMount";
import { useEffect, useState } from "react";

export interface ClusterPageProps {
	params: { mClusterName: string; clusterName: string };
}

interface ControlPlane {
	name: string;
	version: string;
	status: string;
	ready: number[];
}

interface Worker {
	name: string;
	version: string;
	status: string;
	ready: number[];
}

export function useViewModel(props: ClusterPageProps) {
	const [controlPlanes, setControlPlanes] = useState<ControlPlane[]>([]);
	const [workers, setWorkers] = useState<Worker[]>([]);
	const [loading, setLoading] = useState<boolean>(true);

	async function loadInformation() {
		const kubeconfig = await electron.capi.getManagementCluster(
			props.params.mClusterName
		);

		const cluster = await electron.kubectl.get(kubeconfig.kubeconfig, {
			resource: "cluster",
			name: props.params.clusterName,
		});

		const controlPlaneMachines = await electron.kubectl.get(
			kubeconfig.kubeconfig,
			{
				resource: "machine",
				flags: {
					label: [
						`cluster.x-k8s.io/cluster-name=${cluster.metadata.name}`,
						"cluster.x-k8s.io/control-plane",
					],
				},
			}
		);

		const workerMachines = await electron.kubectl.get(
			kubeconfig.kubeconfig,
			{
				resource: "machine",
				flags: {
					label: [
						`cluster.x-k8s.io/cluster-name=${cluster.metadata.name}`,
						"!cluster.x-k8s.io/control-plane",
					],
				},
			}
		);

		await setWorkers(
			workerMachines.items.map(
				(item: any) =>
					({
						name: item.metadata.name,
						version: item.spec.version,
						status: item.status.phase,
						ready: [
							item.status.conditions.filter(
								(x: any) => x.status == "True"
							).length,
							item.status.conditions.length,
						],
					} satisfies Worker)
			)
		);
		await setControlPlanes(
			controlPlaneMachines.items.map(
				(item: any) =>
					({
						name: item.metadata.name,
						version: item.spec.version,
						status: item.status.phase,
						ready: [
							item.status.conditions.filter(
								(x: any) => x.status == "True"
							).length,
							item.status.conditions.length,
						],
					} satisfies ControlPlane)
			)
		);
	}

	useComponentDidMount(async () => {
		await loadInformation();
		setLoading(false);
	});
	useEffect(() => {
		const interval = setInterval(loadInformation, 2000);
		return () => clearInterval(interval);
	}, []);

	return {
		controlPlanes,
		workers,
		loading,
	};
}
