import { KubectlApplyOptions } from "@/main/models/executables/Kubectl";
import { Kubectl } from "@/main/service/executable/Kubectl";

export async function apply(config: string, options: KubectlApplyOptions) {
	const kubectl = new Kubectl(config);
	if (!kubectl.isExists()) {
		throw new Error("kubectl is not available.");
	}

	return await kubectl.apply(options);
}
