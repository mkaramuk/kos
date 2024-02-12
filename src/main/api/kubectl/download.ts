import { Kubectl } from "@/main/service/executable/Kubectl";

export async function download() {
	const kubectl = new Kubectl();

	if (!kubectl.isExists()) {
		await kubectl.download();
	}
}
