import { AddManagementClusterWizardContext } from "@/renderer/components/Modals/AddManagementClusterModal/viewmodel";
import { Loading } from "@/renderer/components/UI/Loading";
import { WizardButtons } from "@/renderer/components/Wizard/WizardButtons";
import { WizardStep } from "@/renderer/components/Wizard/WizardStep";
import { useWizard } from "@/renderer/hooks/useWizard";
import { useState } from "react";
import { toast } from "react-toastify";
import YAML from "yaml";

export function StepKubeconfigUpload(props: any) {
	const [initialized, setInitialized] = useState<boolean>(true);
	const wizard = useWizard<AddManagementClusterWizardContext>();

	function onFileUploaded(event: React.ChangeEvent<HTMLInputElement>) {
		event.preventDefault();
		if (event.target.files.length > 0) {
			const reader = new FileReader();
			reader.onload = async (file) => {
				const kubeconfig = file.target.result.toString();
				await wizard.setData((data) => ({
					...data,
					isConnecting: true,
				}));
				await wizard.changeNextEnable(false);

				try {
					const validCluster =
						await electron.capi.isManagementCluster(kubeconfig);
					if (validCluster) {
						toast.success(
							"Successfully established connection to the Cluster API management cluster"
						);
						await setInitialized(true);
					} else {
						toast.warning(
							"Cluster is not a Cluster API management cluster"
						);
						await setInitialized(false);
					}
					const parsed = YAML.parse(kubeconfig);
					const contextName = parsed["current-context"];
					await wizard.setData((data) => ({
						...data,
						kubeconfig,
						clusterName: contextName,
						kubeconfigFilename: event.target.files[0].name,
						isConnecting: false,
					}));
					await wizard.changeNextEnable(true);
				} catch (err) {
					const messages = err.message.split("\n");
					console.error(err);
					toast.error(messages[0]);
					await wizard.setData((data) => ({
						...data,
						isConnecting: false,
					}));
				}
			};
			reader.readAsText(event.target.files[0]);
		}
	}

	async function onNextClick() {
		// If cluster is already initialized, go to finish
		if (initialized) {
			await wizard.goToNamedStep("finish");
		} else {
			await wizard.goToNamedStep("select-infrastructures");
		}
	}

	return (
		<WizardStep
			onLoad={() => {
				if (!wizard.data.kubeconfigFilename) {
					wizard.changeNextEnable(false);
				} else {
					wizard.changeNextEnable(true);
				}
				wizard.changePreviousEnable(false);
			}}
			{...props}
		>
			<div className="w-full flex flex-col gap-3">
				<h1 className="text-[20px] font-bold">
					Connect to management cluster
				</h1>
				<hr />
				<p>Choice kubeconfig file of your management cluster</p>
				<div className="h-[30px]" />
				<div className="flex justify-between items-center">
					<label
						htmlFor="kubeconfig-upload"
						className="p-3 rounded-lg border-2 border-gray-400 w-fit hover:cursor-pointer bg-gray-300"
					>
						Select kubeconfig
					</label>
					<input
						className="hidden"
						onChange={onFileUploaded}
						id="kubeconfig-upload"
						type="file"
					/>
					<div>{wizard.data.kubeconfigFilename}</div>
				</div>
				{wizard.data.isConnecting ? <Loading /> : null}
				<WizardButtons
					onNextClick={onNextClick}
					cancelButton
					onCancelClick={wizard.data.onCancel}
				/>
			</div>
		</WizardStep>
	);
}
