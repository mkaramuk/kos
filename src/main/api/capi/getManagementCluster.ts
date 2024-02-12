import { ManagementCluster } from "@/main/models/ManagementCluster";
import { Directories, checkDirectory } from "@/main/service/environment";
import { readdirSync, readFileSync } from "fs";

export async function getManagementCluster(
	name: string
): Promise<ManagementCluster> {
	const dir = `${checkDirectory(Directories.ManagementClusterConfig)}`;
	const configFiles = readdirSync(dir).filter((x) =>
		x.endsWith(".kubeconfig")
	);

	const cluster = configFiles.find(
		(filename) => filename.replace(".kubeconfig", "") == name
	);

	if (!cluster) {
		throw new Error(`Cluster ${name} is no available`);
	}

	return {
		kubeconfig: readFileSync(`${dir}/${cluster}`, {
			encoding: "utf-8",
		}).toString(),
		name: cluster.replace(".kubeconfig", ""),
	};
}
