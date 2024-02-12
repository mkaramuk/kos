import { Kubectl } from "@/main/service/executable/Kubectl";

export async function isManagementCluster(config: string): Promise<boolean> {
	const kubectl = new Kubectl(config);
	if (!kubectl.isExists()) {
		throw new Error("kubectl is not available");
	}

	const namespaces = await kubectl.get({
		resource: "ns",
	});

	// Another check method can be used.
	// We check if capi namespaces exist in the cluster
	// They are: capi-kubeadm-bootstrap-system, capi-system, capi-kubeadm-control-plane-system
	let correction = 0;

	for (const ns of namespaces.items) {
		if (
			[
				"capi-kubeadm-bootstrap-system",
				"capi-kubeadm-control-plane-system",
				"capi-system",
			].find((x) => x == ns.metadata.name)
		) {
			correction++;
		}
		if (correction == 3) {
			return true;
		}
	}

	return false;
}
