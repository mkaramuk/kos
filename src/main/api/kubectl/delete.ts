import { KubectlQueryOptions } from "@/main/models/executables/Kubectl";
import { Kubectl } from "@/main/service/executable/Kubectl";

export async function kDelete(config: string, options: KubectlQueryOptions) {
	const kubectl = new Kubectl(config);
	if (!kubectl.isExists()) {
		throw new Error("kubectl is not available.");
	}

	return await kubectl.delete(options);
}
