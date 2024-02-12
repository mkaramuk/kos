import { CreateClusterWizardContext } from "@/renderer/components/Modals/CreateClusterModal/viewmodel";
import { WizardButtons } from "@/renderer/components/Wizard/WizardButtons";
import { WizardStep } from "@/renderer/components/Wizard/WizardStep";
import { useWizard } from "@/renderer/hooks/useWizard";
import { useState } from "react";
import { toast } from "react-toastify";

export function StepGenerateCluster(props: any) {
	const [info, setInfo] = useState<string>("");
	const wizard = useWizard<CreateClusterWizardContext>();

	async function onLoad() {
		await wizard.changePreviousEnable(false);
		await wizard.changeNextEnable(false);

		try {
			await setInfo("Generating resources");
			const manifest = await electron.clusterctl.generateCluster(
				wizard.data.kubeconfig,
				{
					controlPlaneCount: wizard.data.controlPlaneCount.value,
					workerCount: wizard.data.workerCount,
					infrastructure: wizard.data.provider.value,
					kubernetesVersion: wizard.data.version.value,
					name: wizard.data.clusterName,
				}
			);

			await setInfo("The manifest file being applied");
			await electron.kubectl.apply(wizard.data.kubeconfig, {
				content: manifest,
			});
			wizard.goToNamedStep("finish");
		} catch (err) {
			toast.error(err.message.split("\n")[0]);
			await wizard.changeNextEnable(true);
			await wizard.goToNamedStep(`cluster-${wizard.data.provider.value}`);
		}
	}

	function onCancelClick() {
		// TODO: Show a question modal and cancel cluster generation process.
		// Don't forget to clean (etc. already applied resource, you should delete them)
	}

	return (
		<WizardStep {...props} onLoad={onLoad}>
			<div className="w-full flex flex-col gap-3">
				<h1 className="text-[20px] font-bold">Cluster creating...</h1>
				<hr />
				<p>
					Your cluster is being created. Please wait until the process
					is complete.
				</p>
				<div className="w-full text-center italic">{info}</div>
				<div className="w-full">
					<div className="h-1.5 w-full bg-blue-100 overflow-hidden">
						<div className="progress w-full h-full bg-blue-500 left-right"></div>
					</div>
				</div>
				<WizardButtons
					cancelButton
					cancelEnabled={false}
					onCancelClick={onCancelClick}
				/>
			</div>
		</WizardStep>
	);
}
