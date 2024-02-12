import { ipcMain } from "electron";
import { kDelete as kubectl_delete } from "./kubectl/delete";
import { check as kubectl_check } from "@/main/api/kubectl/check";
import { download as kubectl_download } from "@/main/api/kubectl/download";
import { get as kubectl_get } from "@/main/api/kubectl/get";
import { apply as kubectl_apply } from "@/main/api/kubectl/apply";
import { check as clusterctl_check } from "@/main/api/clusterctl/check";
import { download as clusterctl_download } from "@/main/api/clusterctl/download";
import { generateCluster as clusterctl_generateCluster } from "@/main/api/clusterctl/generateCluster";
import { getKubeconfig as clusterctl_getKubeconfig } from "./clusterctl/getKubeconfig";
import { init as clusterctl_init } from "./clusterctl/init";
import { isManagementCluster } from "@/main/api/capi/isManagementCluster";
import { addManagementCluster } from "@/main/api/capi/addManagementCluster";
import { getManagementClusters } from "@/main/api/capi/getManagementClusters";
import { getManagementCluster } from "@/main/api/capi/getManagementCluster";
import { deleteManagementCluster } from "./capi/deleteManagementCluster";
import { saveFile } from "./os/saveFile";

export function initializeChannels() {
	/// electron.kubectl.*
	ipcMain.handle("electron.kubectl.apply", (_, args) =>
		kubectl_apply(args[0], args[1])
	);
	ipcMain.handle("electron.kubectl.check", kubectl_check);
	ipcMain.handle("electron.kubectl.get", (_, args) =>
		kubectl_get(args[0], args[1])
	);
	ipcMain.handle("electron.kubectl.delete", (_, args) =>
		kubectl_delete(args[0], args[1])
	);
	ipcMain.handle("electron.kubectl.download", kubectl_download);

	/// electron.clusterctl.*
	ipcMain.handle("electron.clusterctl.generateCluster", (_, args) =>
		clusterctl_generateCluster(args[0], args[1])
	);
	ipcMain.handle("electron.clusterctl.getKubeconfig", (_, args) =>
		clusterctl_getKubeconfig(args[0], args[1])
	);
	ipcMain.handle("electron.clusterctl.init", (_, args) =>
		clusterctl_init(args[0], args[1], args[2])
	);
	ipcMain.handle("electron.clusterctl.check", clusterctl_check);
	ipcMain.handle("electron.clusterctl.download", clusterctl_download);

	/// electron.capi.*
	ipcMain.handle(
		"electron.capi.getManagementClusters",
		getManagementClusters
	);
	ipcMain.handle("electron.capi.getManagementCluster", (_, args) =>
		getManagementCluster(args[0])
	);
	ipcMain.handle("electron.capi.isManagementCluster", (_, args) =>
		isManagementCluster(args[0])
	);
	ipcMain.handle("electron.capi.addManagementCluster", (_, args) =>
		addManagementCluster(args[0], args[1])
	);
	ipcMain.handle("electron.capi.deleteManagementCluster", (_, args) =>
		deleteManagementCluster(args[0])
	);

	/// electron.os.*
	ipcMain.handle("electron.os.saveFile", (_, args) => saveFile(args[0]));
}
