// NOTE: This file calls only by preload script.

import { ManagementCluster } from "@/main/models/ManagementCluster";
import { GenerateClusterOptions } from "@/main/models/executables/Clusterctl";
import {
	KubectlApplyOptions,
	KubectlQueryOptions,
} from "@/main/models/executables/Kubectl";
import { ipcRenderer } from "electron";
import { Infrastructure } from "../models/Infrastructure";

export default {
	kubectl: {
		apply: (config: string, options: KubectlApplyOptions) =>
			ipcRenderer.invoke("electron.kubectl.apply", [
				config,
				options,
			]) as Promise<any>,
		get: (config: string, query: KubectlQueryOptions) =>
			ipcRenderer.invoke("electron.kubectl.get", [
				config,
				query,
			]) as Promise<any>,
		delete: (config: string, query: KubectlQueryOptions) =>
			ipcRenderer.invoke("electron.kubectl.delete", [
				config,
				query,
			]) as Promise<any>,
		check: () =>
			ipcRenderer.invoke("electron.kubectl.check") as Promise<boolean>,
		download: () => ipcRenderer.invoke("electron.kubectl.download"),
	},
	clusterctl: {
		getKubeconfig: (config: string, clusterName: string) =>
			ipcRenderer.invoke("electron.clusterctl.getKubeconfig", [
				config,
				clusterName,
			]) as Promise<string>,
		generateCluster: (config: string, options: GenerateClusterOptions) =>
			ipcRenderer.invoke("electron.clusterctl.generateCluster", [
				config,
				options,
			]) as Promise<string>,
		init: (config: string, infrastructure: Infrastructure, env: any) =>
			ipcRenderer.invoke("electron.clusterctl.init", [
				config,
				infrastructure,
				env,
			]),
		check: () =>
			ipcRenderer.invoke("electron.clusterctl.check") as Promise<boolean>,
		download: () => ipcRenderer.invoke("electron.clusterctl.download"),
	},
	capi: {
		getManagementCluster: (name: string) =>
			ipcRenderer.invoke("electron.capi.getManagementCluster", [
				name,
			]) as Promise<ManagementCluster>,
		getManagementClusters: () =>
			ipcRenderer.invoke(
				"electron.capi.getManagementClusters"
			) as Promise<ManagementCluster[]>,
		addManagementCluster: (config: string, name: string) =>
			ipcRenderer.invoke("electron.capi.addManagementCluster", [
				config,
				name,
			]),
		deleteManagementCluster: (name: string) =>
			ipcRenderer.invoke("electron.capi.deleteManagementCluster", [name]),
		isManagementCluster: (config: string) =>
			ipcRenderer.invoke("electron.capi.isManagementCluster", [
				config,
			]) as Promise<boolean>,
	},
	os: {
		saveFile: (content: string) =>
			ipcRenderer.invoke("electron.os.saveFile", [content]),
	},
};
