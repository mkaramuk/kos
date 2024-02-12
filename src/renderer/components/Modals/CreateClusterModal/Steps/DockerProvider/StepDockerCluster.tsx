import { WizardButtons } from "@/renderer/components/Wizard/WizardButtons";
import { WizardStep } from "@/renderer/components/Wizard/WizardStep";
import { useWizard } from "@/renderer/hooks/useWizard";
import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";
import { InputTextField } from "@/renderer/components/HookForm/InputTextField";
import { InputSelect } from "@/renderer/components/HookForm/InputSelect";
import YAML from "yaml";
import moment from "moment";
import * as yup from "yup";
import {
	CreateClusterWizardContext,
	Option,
} from "@/renderer/components/Modals/CreateClusterModal/viewmodel";

const formSchema = yup.object().shape({
	clusterName: yup
		.string()
		.min(3, "Cluster name must be at least 3 character"),
	version: yup
		.object()
		.shape({
			label: yup.string(),
			value: yup.string(),
		})
		.required("Select a Kubernetes version"),
	controlPlaneCount: yup
		.object()
		.shape({
			label: yup.string(),
			value: yup.number(),
		})
		.required("Select control plane count"),
	workerCount: yup
		.number()
		.integer("Worker count must be a whole number")
		.typeError("Invalid number")
		.min(1, "Minimum worker count is 1")
		.max(100, "Maximum worker count is 100")
		.required("Enter worker count"),
});
type DockerClusterForm = yup.InferType<typeof formSchema>;

export function StepDockerCluster(props: any) {
	const formMethods = useForm<DockerClusterForm>({
		resolver: yupResolver(formSchema),
	});

	const [k8sVersions, setK8sVersions] = useState<Option[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const wizard = useWizard<CreateClusterWizardContext>();

	function onPreviousStepClick() {
		wizard.goToNamedStep("select-provider");
	}

	async function onLoad() {
		wizard.changePreviousEnable(true);

		if (k8sVersions.length == 0) {
			await setLoading(true);
			const req = await fetch(
				"https://raw.githubusercontent.com/kubernetes/website/main/data/releases/schedule.yaml"
			);
			const releaseInfo = YAML.parse(await req.text());
			const list: Option[] = [];
			const now = moment();
			for (const item of releaseInfo.schedules) {
				const eolDATE = moment(item.endOfLifeDate, "YYYY-MM-DD");
				if (now.isAfter(eolDATE)) {
					continue;
				}

				for (const patch of item.previousPatches) {
					list.push({
						label: patch.release.toString(),
						value: patch.release.toString(),
					});
				}
			}

			await setK8sVersions(list);
			await setLoading(false);
		}
	}

	const onNextStepClick = formMethods.handleSubmit(async (values) => {
		await wizard.setData((old) => ({
			...old,
			...values,
		}));
		await wizard.goToNamedStep("generate-cluster");
	});

	return (
		<WizardStep {...props} onLoad={onLoad}>
			<div className="w-full flex flex-col gap-3">
				<h1 className="text-[20px] font-bold">Cluster settings</h1>
				<hr />
				<p>Enter the settings of your cluster.</p>
				<FormProvider {...formMethods}>
					<form className="flex flex-col w-full gap-3">
						<InputTextField
							name="clusterName"
							label="Cluster Name:"
						/>
						<div className="flex flex-col gap-1">
							<div>Kubernetes Version:</div>
							<InputSelect
								name="version"
								isSearchable={false}
								isLoading={loading}
								options={k8sVersions}
							/>
						</div>
						<div className="flex flex-col gap-1">
							<div>Control Plane Count:</div>
							<InputSelect
								name="controlPlaneCount"
								isSearchable={false}
								options={[
									{ label: "1", value: 1 },
									{ label: "3", value: 3 },
									{ label: "5", value: 5 },
									{ label: "7", value: 7 },
								]}
							/>
						</div>
						<InputTextField
							name="workerCount"
							label="Worker Count:"
							type="number"
							defaultValue="1"
						/>
					</form>
				</FormProvider>
				<WizardButtons
					cancelButton
					onNextClick={onNextStepClick}
					onBackClick={onPreviousStepClick}
					onCancelClick={wizard.data.onCancel}
				/>
			</div>
		</WizardStep>
	);
}
