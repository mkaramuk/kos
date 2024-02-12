import { useComponentDidMount } from "@/renderer/hooks/useComponentDidMount";
import { useState } from "react";
import { useLocation } from "wouter";
import {
	QuestionModal,
	YesNoChoices,
} from "@/renderer/components/Modals/QuestionModal";
import { toast } from "react-toastify";
import { useModal } from "@/renderer/stores/useModal";
import { Infrastructure } from "@/main/models/Infrastructure";

export interface ClusterCardProps {
	kubeconfig: string;
	name: string;
	onClusterRemoved?: () => void;
}

export interface ManagementClusterInfo {
	supportedProviders: Infrastructure[];
}

export function useViewModel(props: ClusterCardProps) {
	const modal = useModal();
	const [_, navigate] = useLocation();
	const [loading, setLoading] = useState<boolean>(true);
	const [info, setInfo] = useState<ManagementClusterInfo>({
		supportedProviders: [],
	});

	function onClick() {
		navigate(`/management-clusters/${props.name}/clusters`, {
			replace: true,
		});
	}

	function onDeleteClusterClick() {
		modal.openModal(QuestionModal, {
			props: {
				title: `Delete cluster ${props.name}`,
				choices: YesNoChoices(
					() => {
						toast.promise(
							async () => {
								setLoading(true);
								await electron.capi.deleteManagementCluster(
									props.name
								);
								props.onClusterRemoved?.();
								setLoading(false);
							},
							{
								pending: `Cluster ${props.name} is removing...`,
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
				question: `Cluster ${props.name} will remove from KOS. Are you sure?`,
			},
		});
	}

	useComponentDidMount(async () => {
		const namespaces = await electron.kubectl.get(props.kubeconfig, {
			resource: "ns",
		});
		const supportedProviders: Infrastructure[] = [];
		for (const ns of namespaces.items) {
			switch (ns.metadata.name) {
				case "capd-system":
					supportedProviders.push(Infrastructure.Docker);
					break;
				case "capg-system":
					supportedProviders.push(Infrastructure.GoogleCloudPlatform);
					break;
			}
		}
		setInfo((state) => ({
			...state,
			supportedProviders,
		}));
		setLoading(false);
	});

	return {
		loading,
		info,
		onClick,
		onDeleteClusterClick,
	};
}
