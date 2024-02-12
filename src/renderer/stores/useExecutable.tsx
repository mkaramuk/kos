import { toast } from "react-toastify";
import { create } from "zustand";

export enum ExecutableState {
	Available,
	Unavailable,
	Downloading,
}

interface ExecutableStore {
	kubectl: ExecutableState;
	clusterctl: ExecutableState;

	checkKubectl: () => Promise<void>;
	checkClusterctl: () => Promise<void>;
}

export const useExecutable = create<ExecutableStore>((set) => ({
	kubectl: ExecutableState.Unavailable,
	clusterctl: ExecutableState.Unavailable,
	async checkClusterctl() {
		let isExists = await electron.clusterctl.check();
		if (!isExists) {
			set(() => ({ clusterctl: ExecutableState.Downloading }));
		}

		while (!isExists) {
			await toast.promise(electron.clusterctl.download(), {
				pending: {
					render() {
						return (
							<div>
								<b>
									<i>clusterctl</i>
								</b>{" "}
								is not available. Downloading...
							</div>
						);
					},
				},
			});
			isExists = await electron.clusterctl.check();
		}
		set(() => ({ clusterctl: ExecutableState.Available }));
	},
	async checkKubectl() {
		let isExists = await electron.kubectl.check();
		if (!isExists) {
			set(() => ({ kubectl: ExecutableState.Downloading }));
		}
		while (!isExists) {
			await toast.promise(electron.kubectl.download(), {
				pending: {
					render() {
						return (
							<div>
								<b>
									<i>kubectl</i>
								</b>{" "}
								is not available. Downloading...
							</div>
						);
					},
				},
			});
			isExists = await electron.kubectl.check();
		}
		set(() => ({ kubectl: ExecutableState.Available }));
	},
}));
