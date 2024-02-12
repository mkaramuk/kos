import tmp from "tmp";
import { writeFileSync } from "fs";
import { ClientExecutable } from "./ClientExecutable";
import { platform } from "../Platform";
import { GenerateClusterOptions } from "@/main/models/executables/Clusterctl";
import { Infrastructure } from "@/main/models/Infrastructure";

export class Clusterctl extends ClientExecutable {
	private config: string;

	public constructor(config?: string, abortController?: AbortController) {
		super("clusterctl", abortController);
		this.config = config ?? "";
	}

	/**
	 * Get kubeconfig of cluster which has name `clusterName`.
	 * @param clusterName Cluster name.
	 * @returns Kubeconfig content of cluster.
	 */
	public async getClusterKubeconfig(clusterName: string) {
		return await this.exec(["get", "kubeconfig", clusterName]);
	}

	public async init<T>(infrastructure: Infrastructure, env: T) {
		await this.exec(["init", "--infrastructure", infrastructure], env);
	}

	/**
	 * Generate yaml file for cluster creation.
	 * @returns An yaml file content that applicable to management cluster.
	 */
	public async generateCluster(
		options: GenerateClusterOptions
	): Promise<string> {
		const args: string[] = [
			"generate",
			"cluster",
			options.name,
			"--infrastructure",
			options.infrastructure,
			"--kubernetes-version",
			options.kubernetesVersion,
			"--control-plane-machine-count",
			options.controlPlaneCount?.toString(),
			"--worker-machine-count",
			options.workerCount?.toString(),
		];

		const env: any = {};

		switch (options.infrastructure) {
			case Infrastructure.Docker:
				args.push("--flavor", "development");
				break;
		}

		return await this.exec(args, env);
	}

	public async exec(args?: any[], env?: any): Promise<string> {
		return new Promise(async (res, rej) => {
			const file = tmp.fileSync();
			try {
				writeFileSync(file.name, this.config, { encoding: "utf-8" });
				res(
					await super.exec(args, {
						KUBECONFIG: file.name,
						...env,
					})
				);
			} catch (err) {
				rej(err);
			} finally {
				file.removeCallback();
			}
		});
	}

	protected async getDownloadUrl(): Promise<string> {
		return `https://github.com/kubernetes-sigs/cluster-api/releases/latest/download/clusterctl-${platform.osFamily}-amd64${platform.exeExtension}`;
	}
}
