import { AddManagementClusterWizardContext } from "../viewmodel";
import { Loading } from "@/renderer/components/UI/Loading";
import { WizardButtons } from "@/renderer/components/Wizard/WizardButtons";
import { WizardStep } from "@/renderer/components/Wizard/WizardStep";
import { useWizard } from "@/renderer/hooks/useWizard";
import { InfrastructureLabel } from "@/renderer/models/InfrastructureLabel.enum";
import { useState } from "react";
import { toast } from "react-toastify";

export function StepInitialize(props: any) {
	const [info, setInfo] = useState<string>("");
	const wizard = useWizard<AddManagementClusterWizardContext>();

	async function onLoad() {
		await wizard.changePreviousEnable(false);
		await wizard.changeNextEnable(false);

		for (const provider of wizard.data.providers) {
			try {
				setInfo(InfrastructureLabel[provider.name]);
				await electron.clusterctl.init(
					wizard.data.kubeconfig,
					provider.name,
					provider.envVariables
				);
			} catch (err) {
				console.error(err.message);
				toast.error(err.message.split("\n")[0]);

				// When something went wrong, go to the configuration step of the
				// failed infrastructure.
				const stepName = provider.stepName ?? "select-infrastructures";
				await wizard.goToNamedStep(stepName);
				return;
			}
		}
		await wizard.goToNamedStep("finish");
	}

	return (
		<WizardStep onLoad={onLoad} {...props}>
			<div className="w-full flex flex-col gap-3">
				<h1 className="text-[20px] font-bold">Initializing</h1>
				<hr />
				<p>
					The cluster you have selected is being initialized for the
					following infrastructures.
				</p>
				<div className="w-full flex flex-col items-center gap-2">
					<div>
						Infrastructure{" "}
						<b>
							<i>{info}</i>
						</b>{" "}
						is initializing
					</div>
					<Loading />
				</div>
				<WizardButtons
					cancelButton
					onCancelClick={wizard.data.onCancel}
				/>
			</div>
		</WizardStep>
	);
}
