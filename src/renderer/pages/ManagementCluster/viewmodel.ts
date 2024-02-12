import { Infrastructure } from "@/main/models/Infrastructure";
import { CreateClusterModal } from "@/renderer/components/Modals/CreateClusterModal";
import {
	QuestionModal,
	YesNoChoices,
} from "@/renderer/components/Modals/QuestionModal";
import { useComponentDidMount } from "@/renderer/hooks/useComponentDidMount";
import { useModal } from "@/renderer/stores/useModal";
import { ComponentType, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useLocation } from "wouter";

export interface ManagementClusterPageProps {
	params: { clusterName: string };
}

interface Cluster {
	provider: string;
	masterCount: number;
	workerCount: number;
	readyStates: boolean[];
	name: string;
	status: string;
}

export function useViewModel(props: ManagementClusterPageProps) {
	const modal = useModal();
	const [_, navigate] = useLocation();
	const [kubeconfig, setKubeconfig] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(true);
	const [clusters, setClusters] = useState<Cluster[]>([]);

	async function loadClusters() {
		const mCluster = await electron.capi.getManagementCluster(
			props.params.clusterName
		);
		const list = await electron.kubectl.get(mCluster.kubeconfig, {
			resource: "cluster",
		});

		const clusterList: Cluster[] = [];

		for (const cluster of list.items) {
			switch (cluster.spec.infrastructureRef.kind) {
				case "DockerCluster":
					const controlPlane = await electron.kubectl.get(
						mCluster.kubeconfig,
						{
							resource: "kubeadmcontrolplane",
							name: cluster.spec.controlPlaneRef.name,
						}
					);

					let workerCount = 0;
					for (const deployment of cluster.spec.topology.workers
						.machineDeployments) {
						workerCount += deployment.replicas;
					}

					const readyStates = [];

					for (const condition of cluster.status.conditions) {
						readyStates.push(condition.status == "True");
					}

					clusterList.push({
						name: cluster.metadata.name,
						provider: Infrastructure.Docker,
						masterCount: controlPlane.spec.replicas,
						workerCount,
						readyStates,
						status: cluster.status.phase,
					});
					break;
			}
		}

		setKubeconfig(mCluster.kubeconfig);
		setClusters(clusterList);
	}

	function onCreateClusterClick() {
		modal.openModal(CreateClusterModal, {
			props: {
				clusterName: props.params.clusterName,
				kubeconfig,
			},
		});
	}

	function onClusterClick(clusterName: string) {
		const cluster = clusters.find((x) => x.name == clusterName);
		if (cluster.status == "Deleting") {
			return;
		}

		navigate(
			`/management-clusters/${props.params.clusterName}/clusters/${clusterName}`
		);
	}

	async function onSaveKubeconfigClick(clusterName: string) {
		try {
			const clusterKubeconfig = await electron.clusterctl.getKubeconfig(
				kubeconfig,
				clusterName
			);
			await electron.os.saveFile(clusterKubeconfig);
		} catch (err) {
			toast.error(err.message);
		}
	}

	function onDeleteClusterClick(clusterName: string) {
		modal.openModal<typeof QuestionModal>(QuestionModal, {
			props: {
				title: `Delete cluster ${clusterName}`,
				choices: YesNoChoices(
					() => {
						toast.promise(
							async () => {
								await electron.kubectl.delete(kubeconfig, {
									resource: "cluster",
									name: clusterName,
								});
								loadClusters();
							},
							{
								pending: `Cluster ${clusterName} is destroying...`,
								error: {
									render(props) {
										return (props.data as Error).message;
									},
								},
							}
						);
						modal.closeModal();
					},
					() => modal.closeModal()
				),
				question: `Cluster ${clusterName} will delete. This operation is irreversible. Are you sure?`,
			},
		});
	}

	useComponentDidMount(async () => {
		await loadClusters();
		setLoading(false);
	});

	useEffect(() => {
		const interval = setInterval(() => loadClusters(), 2000);
		return () => clearInterval(interval);
	}, []);

	return {
		loading,
		clusters,
		onDeleteClusterClick,
		onCreateClusterClick,
		onSaveKubeconfigClick,
		onClusterClick,
	};
}
