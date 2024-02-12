import { nextProviderConfig, previousProviderConfig } from "./viewmodel-shared";
import { AddManagementClusterWizardContext } from "../../viewmodel";
import { WizardButtons } from "@/renderer/components/Wizard/WizardButtons";
import { WizardStep } from "@/renderer/components/Wizard/WizardStep";
import { useWizard } from "@/renderer/hooks/useWizard";

export function StepConfigurationGcp(props: any) {
	const wizard = useWizard<AddManagementClusterWizardContext>();

	function onFileUploaded(event: React.ChangeEvent<HTMLInputElement>) {
		event.preventDefault();

		if (event.target.files.length > 0) {
			const reader = new FileReader();
			reader.onload = async (file) => {
				const credentials = file.target.result.toString();
				const providers = [...wizard.data.providers];
				const gcpIndex = providers.findIndex((x) => x.name == "gcp");

				// Set env variables for infrastructure
				providers[gcpIndex].envVariables.GCP_B64ENCODED_CREDENTIALS =
					btoa(credentials);

				// To show the file name
				providers[gcpIndex].metadata.filename =
					event.target.files[0].name;
				await wizard.setData((data) => ({
					...data,
					providers,
				}));
				await wizard.changeNextEnable(true);
			};
			reader.readAsText(event.target.files[0]);
		}
	}

	async function onNextClick() {
		await nextProviderConfig("gcp", wizard);
	}

	async function onBackClick() {
		await previousProviderConfig("gcp", wizard);
	}

	return (
		<WizardStep
			onLoad={() => {
				wizard.changePreviousEnable(true);

				// Don't disable next button if the file already selected
				wizard.changeNextEnable(
					!!wizard.data.providers.find((x) => x.name == "gcp")
						?.metadata.filename
				);
			}}
			{...props}
		>
			<div className="w-full flex flex-col gap-3">
				<h1 className="text-[20px] font-bold">Google Cloud Platform</h1>
				<hr />
				<p>Select the service account credentials file.</p>
				<div className="flex justify-between items-center">
					<label
						htmlFor="gcp-credentials-upload"
						className="p-3 rounded-lg border-2 border-gray-400 w-fit hover:cursor-pointer bg-gray-300"
					>
						Select credentials
					</label>
					<input
						className="hidden"
						onChange={onFileUploaded}
						id="gcp-credentials-upload"
						type="file"
					/>
					<div>
						{
							wizard.data.providers.find((x) => x.name == "gcp")
								?.metadata.filename
						}
					</div>
				</div>
				<WizardButtons
					onNextClick={onNextClick}
					onBackClick={onBackClick}
					cancelButton
					onCancelClick={wizard.data.onCancel}
				/>
			</div>
		</WizardStep>
	);
}
