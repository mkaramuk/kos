import { dialog, BrowserWindow } from "electron";
import { writeFileSync } from "fs";

export async function saveFile(content: string) {
	const path = dialog.showSaveDialogSync(BrowserWindow.getAllWindows()[0], {
		title: "Save kubeconfig of the cluster",
		defaultPath: "cluster-config.yaml",
	});

	writeFileSync(path, content, { encoding: "utf-8" });
}
