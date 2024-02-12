import { Infrastructure } from "@/main/models/Infrastructure";
import { Clusterctl } from "@/main/service/executable/Clusterctl";

export async function init(
	config: string,
	infrastructure: Infrastructure,
	env: any
) {
	const clusterctl = new Clusterctl(config);
	if (!clusterctl.isExists()) {
		throw new Error("clusterctl is not available");
	}

	return await clusterctl.init(infrastructure, env);
}
