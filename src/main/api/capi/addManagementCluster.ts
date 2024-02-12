import { Directories, checkDirectory } from "@/main/service/environment";
import { existsSync } from "fs";
import { writeFileSync } from "fs";

export async function addManagementCluster(config: string, name: string) {
	const path = `${checkDirectory(
		Directories.ManagementClusterConfig
	)}/${name}.kubeconfig`;
	if (existsSync(path)) {
		throw new Error(`Management cluster ${name} is already available`);
	}

	writeFileSync(path, config, { encoding: "utf-8", mode: 0o600 });
}
