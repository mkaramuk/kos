import { KubectlQueryOptions } from "@/main/models/executables/Kubectl";
import { Kubectl } from "@/main/service/executable/Kubectl";

export async function get(config: string, query: KubectlQueryOptions) {
	const kubectl = new Kubectl(config);
	if (!kubectl.isExists()) {
		throw new Error("kubectl is not available.");
	}

	return await kubectl.get(query);
}
