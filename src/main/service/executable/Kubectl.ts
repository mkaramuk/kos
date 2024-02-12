import tmp from "tmp";
import { ClientExecutable } from "./ClientExecutable";
import { platform } from "../Platform";
import { writeFileSync } from "fs";
import {
	KubectlApplyOptions,
	KubectlFlags,
	KubectlPatchOptions,
	KubectlQueryOptions,
	KubectlRunOptions,
} from "@/main/models/executables/Kubectl";

export class Kubectl extends ClientExecutable {
	private config: string;

	public constructor(config?: string, abortController?: AbortController) {
		super("kubectl", abortController);
		this.config = config ?? "";
	}

	public async get({ resource, name, flags: options }: KubectlQueryOptions) {
		return await this.execWithOptions({
			args: ["get", resource, name],
			flags: options,
		});
	}

	public async delete({ resource, name, flags }: KubectlQueryOptions) {
		if (!flags) {
			flags = {};
		}
		flags.outputType = "plaintext";

		return await this.execWithOptions({
			args: ["delete", resource, name, "--wait=false"],
			flags,
		});
	}

	public async patch({
		resource,
		type,
		name,
		flags: options,
		patch,
		patchFile,
	}: KubectlPatchOptions) {
		const args = ["patch", resource, name];

		if (type) {
			args.push("--type", type);
		}

		if (patch) {
			args.push("-p");
			if (typeof patch === "object") {
				args.push(JSON.stringify(patch));
			} else {
				args.push(patch);
			}
		} else if (patchFile) {
			args.push("--patch-file", patchFile);
		}
		return await this.execWithOptions({
			args,
			flags: options,
		});
	}

	public async apply({
		path,
		content,
		flags,
	}: KubectlApplyOptions): Promise<string | any> {
		if (path) {
			return await this.execWithOptions({
				args: ["apply", "-f", path],
				flags,
			});
		}
		if (content) {
			return new Promise(async (resolve, reject) => {
				const file = tmp.fileSync();
				writeFileSync(file.name, content, { encoding: "utf-8" });
				try {
					resolve(
						await this.execWithOptions({
							args: ["apply", "-f", file.name],
							flags,
						})
					);
				} catch (err) {
					reject(err);
				} finally {
					file.removeCallback();
				}
			});
		}
		throw new TypeError("No path or content given.");
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

	private async execWithOptions(
		options: KubectlRunOptions
	): Promise<string | any> {
		options.args.push(...this.parseFlags(options.flags));
		const output = await this.exec(options.args, options.env);

		if (options?.flags?.outputType === "plaintext") {
			return output;
		}

		return JSON.parse(output);
	}

	private parseFlags(flags?: KubectlFlags): string[] {
		const args: string[] = [];
		if (flags?.outputType?.startsWith("json")) {
			args.push("-o", flags.outputType);
		} else if (flags?.outputType !== "plaintext") {
			args.push("-o", "json");
		}

		if (flags?.label) {
			args.push("-l");
			if (typeof flags.label == "string") {
				args.push(flags.label);
			} else if (Array.isArray(flags.label)) {
				args.push(flags.label.join(","));
			}
		}

		if (flags?.allNamespaces) {
			args.push("-A");
		} else if (flags?.namespace) {
			args.push("-n", flags.namespace);
		}

		return args;
	}

	protected async getDownloadUrl(): Promise<string> {
		const response = await fetch("https://dl.k8s.io/release/stable.txt");
		if (response.ok) {
			return `https://dl.k8s.io/release/${await response.text()}/bin/${
				platform.osFamily
			}/${platform.arch}/kubectl`;
		} else {
			throw new Error(`Couldn't get download link`);
		}
	}
}
