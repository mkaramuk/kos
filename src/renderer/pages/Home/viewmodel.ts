import { AddManagementClusterModal } from "@/renderer/components/Modals/AddManagementClusterModal";
import { useComponentDidMount } from "@/renderer/hooks/useComponentDidMount";
import { useModal } from "@/renderer/stores/useModal";
import { useState } from "react";

interface ManagementCluster {
	name: string;
	kubeconfig: string;
}

export function useViewModel() {
	const modal = useModal();
	const [clusters, setClusters] = useState<ManagementCluster[]>([]);

	async function loadClusters() {
		setClusters(await electron.capi.getManagementClusters());
	}

	function onAddClusterClick() {
		modal.openModal(AddManagementClusterModal, {
			persist: true,
			props: {
				onFinish: loadClusters,
			},
		});
	}

	useComponentDidMount(loadClusters);

	return {
		modal,
		clusters,
		onAddClusterClick,
		loadClusters,
	};
}
