import { accessSync, chmodSync, constants } from "fs";
import { execFile } from "child_process";
import { download } from "@/main/service/downloader";
import { platform } from "@/main/service/Platform";
import {
	Directories,
	basePath,
	checkDirectory,
	findInPath,
} from "@/main/service/environment";

/**
 * Represents common code for client executables, like kubectl, clusterctl ...
 */
export abstract class ClientExecutable {
	MAX_DOWNLOAD_RETRIES: number = 3;

	/**
	 * Executable file name. (Not absolute or relative path)
	 */
	public name: string;

	/**
	 * Absolute path of the executable file.
	 */
	public path: string;

	public abortController: AbortController;

	public constructor(name: string, abortController?: AbortController) {
		this.abortController = abortController ?? new AbortController();
		this.name = name;
		this.path = `${checkDirectory(Directories.Binary)}/${this.name}${
			platform.exeExtension
		}`;
	}

	/**
	 * Checks existence of the executable file.
	 * @returns Path of the executable file.
	 */
	public check(): string {
		try {
			return findInPath(`${this.name}${platform.exeExtension}`);
		} catch (err) {
			accessSync(this.path, constants.F_OK);
			return this.path;
		}
	}

	/**
	 * Checks existence of the executable file. But unlike {@link check()}
	 * returns boolean value instead of throw error.
	 * @returns Existence of the executable file.
	 */
	public isExists(): boolean {
		try {
			this.check();
			return true;
		} catch (err) {
			return false;
		}
	}

	/**
	 * Downloads latest version of the executable file and saves it to the binary directory.
	 * @see {@link Directories.Binary}
	 */
	public async download() {
		const url = await this.getDownloadUrl();
		await download(url, this.path, this.MAX_DOWNLOAD_RETRIES);
		chmodSync(this.path, 0o755);
	}

	/**
	 * Runs the executable file and returns its stdout.
	 * @param	args	The arguments will pass to executable.
	 * @param	env		Environment variables.
	 * @returns 		stdout of the executable file.
	 */
	public async exec(args?: any[], env?: any): Promise<string> {
		const path = this.check();
		args = args?.filter((arg) => arg);

		return new Promise((resolve, reject) => {
			execFile(
				path,
				args,
				{
					env,
					cwd: basePath,
					encoding: "utf-8",
					signal: this.abortController.signal,
				},
				(err, stdout) => {
					if (err) {
						return reject(err);
					}
					resolve(stdout);
				}
			);
		});
	}

	/**
	 * Gets the download url for executable file.
	 * @returns Download url.
	 */
	protected abstract getDownloadUrl(): Promise<string>;
}
