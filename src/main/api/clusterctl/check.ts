import { Clusterctl } from "@/main/service/executable/Clusterctl";

export function check() {
	const clusterctl = new Clusterctl();
	return clusterctl.isExists();
}
