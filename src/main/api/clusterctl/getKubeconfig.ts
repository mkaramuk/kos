import { Clusterctl } from "@/main/service/executable/Clusterctl";

export async function getKubeconfig(
	config: string,
	clusterName: string
): Promise<string> {
	const clusterctl = new Clusterctl(config);
	if (!clusterctl.isExists()) {
		throw new Error("clusterctl is not available");
	}

	return await clusterctl.getClusterKubeconfig(clusterName);
}
