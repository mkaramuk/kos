import { accessSync, constants, mkdirSync } from "fs";
import { cwd, env } from "process";
import { platform } from "./Platform";

export const basePath: string = env.HOME ? `${env.HOME}/.kos` : cwd();

export enum Directories {
	Config = "config",
	Binary = "bin",
	ManagementClusterConfig = "config/management-clusters",
	Root = "",
}

export function checkDirectory(directory: Directories): string {
	const path = `${basePath}/${directory}`;
	try {
		accessSync(path, constants.F_OK);
	} catch (err) {
		mkdirSync(path, { recursive: true });
	}
	return path;
}

export function findInPath(fileName: string): string {
	const pathDelimitter = platform.osFamily == "windows" ? ";" : ":";
	const paths = env.PATH?.split(pathDelimitter);

	if (!paths) {
		throw new Error("PATH environment variable doesn't exists!");
	}

	for (const path of paths) {
		const fullPath = `${path}/${fileName}`;
		try {
			accessSync(fullPath, constants.F_OK);
			return fullPath;
		} catch (err) {}
	}
	throw new Error("File couldn't found");
}
