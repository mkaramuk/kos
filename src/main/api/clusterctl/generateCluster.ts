import { GenerateClusterOptions } from "@/main/models/executables/Clusterctl";
import { Clusterctl } from "@/main/service/executable/Clusterctl";

export async function generateCluster(
	config: string,
	options: GenerateClusterOptions
): Promise<string> {
	const clusterctl = new Clusterctl(config);
	if (!clusterctl.isExists()) {
		throw new Error("clusterctl is not available");
	}

	return await clusterctl.generateCluster(options);
}
