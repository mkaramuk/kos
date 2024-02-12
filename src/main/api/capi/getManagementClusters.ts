import { ManagementCluster } from "@/main/models/ManagementCluster";
import { Directories, checkDirectory } from "@/main/service/environment";
import { readdirSync, readFileSync } from "fs";

export async function getManagementClusters(): Promise<ManagementCluster[]> {
	const dir = `${checkDirectory(Directories.ManagementClusterConfig)}`;
	const configFiles = readdirSync(dir).filter((x) =>
		x.endsWith(".kubeconfig")
	);

	return configFiles.map((filename) => ({
		kubeconfig: readFileSync(`${dir}/${filename}`, {
			encoding: "utf-8",
		}).toString(),
		name: filename.replace(".kubeconfig", ""),
	}));
}
