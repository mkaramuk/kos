import { Clusterctl } from "@/main/service/executable/Clusterctl";

export async function download() {
	const clusterctl = new Clusterctl();

	if (!clusterctl.isExists()) {
		await clusterctl.download();
	}
}
