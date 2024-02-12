import { Directories, checkDirectory } from "@/main/service/environment";
import { unlinkSync } from "fs";

export async function deleteManagementCluster(name: string) {
	const path = `${checkDirectory(
		Directories.ManagementClusterConfig
	)}/${name}.kubeconfig`;

	unlinkSync(path);
}
