import { InputCheckbox } from "@/renderer/components/HookForm/InputCheckbox";
import { AddManagementClusterWizardContext, Provider } from "../viewmodel";
import { WizardButtons } from "@/renderer/components/Wizard/WizardButtons";
import { WizardStep } from "@/renderer/components/Wizard/WizardStep";
import { useWizard } from "@/renderer/hooks/useWizard";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { Infrastructure } from "@/main/models/Infrastructure";

const formSchema = yup.object().shape({
	docker: yup.boolean().default(false),
	gcp: yup.boolean().default(false),
});

type SelectInfrastructureForm = yup.InferType<typeof formSchema>;

export function StepSelectInfrastructures(props: any) {
	const wizard = useWizard<AddManagementClusterWizardContext>();
	const formMethods = useForm<SelectInfrastructureForm>({
		resolver: yupResolver(formSchema),
		defaultValues: {
			docker: !!wizard.data.providers.find(
				(x) => x.name == Infrastructure.Docker
			),
			gcp: !!wizard.data.providers.find(
				(x) => x.name == Infrastructure.GoogleCloudPlatform
			),
		},
	});

	const onNextClick = formMethods.handleSubmit(async (values) => {
		let providers: Provider[] = [];

		if (
			values.docker &&
			!wizard.data.providers.find((x) => x.name == Infrastructure.Docker)
		) {
			// Docker does not need configuration.
			// That's why there is not `stepName` for it.
			providers.push({
				name: Infrastructure.Docker,
				metadata: {},
				envVariables: {
					CLUSTER_TOPOLOGY: "true",
				},
			});
		}
		if (
			values.gcp &&
			!wizard.data.providers.find(
				(x) => x.name == Infrastructure.GoogleCloudPlatform
			)
		) {
			providers.push({
				name: Infrastructure.GoogleCloudPlatform,
				metadata: {},
				stepName: "configuration-gcp",
				envVariables: {},
			});
		}

		// If there are not any providers already selected before, set new ones.
		if (wizard.data.providers.length == 0) {
			await wizard.setData((data) => ({ ...data, providers }));
		} else {
			// Otherwise use the ones already present.
			providers = [...wizard.data.providers];
		}

		for (const provider of providers) {
			if (provider.stepName) {
				await wizard.goToNamedStep(provider.stepName);
				return;
			}
		}

		// Go to the initialize step if none of the providers has configuration step.
		await wizard.goToNamedStep("initialize");
	});

	function checkSelectedFields(fields: SelectInfrastructureForm) {
		// Find the fields has 'true' value.
		type KeyType = keyof typeof fields;
		const selected: KeyType[] = (Object.keys(fields) as KeyType[]).filter(
			(x) => !!fields[x]
		);

		wizard.changeNextEnable(selected.length > 0);
	}

	useEffect(() => {
		const subscription = formMethods.watch((value) =>
			checkSelectedFields(value)
		);
		return () => subscription.unsubscribe();
	}, [formMethods.watch]);

	return (
		<WizardStep
			{...props}
			onLoad={() => {
				wizard.changePreviousEnable(true);
				checkSelectedFields(formMethods.getValues());
			}}
		>
			<div className="w-full flex flex-col gap-3">
				<h1 className="text-[20px] font-bold">Infrastructures</h1>
				<hr />
				<p>
					The cluster you have selected is not a Cluster API
					management cluster. You can configure this cluster as a
					management cluster by selecting the infrastructures to
					support.
					<br />
					<br />
					Infrastructures supported by KOS:
				</p>
				<FormProvider {...formMethods}>
					<form className="flex gap-5 flex-wrap w-full">
						<InputCheckbox label="Docker" name="docker" />
						<InputCheckbox
							label="Google Cloud Platform"
							name="gcp"
						/>
					</form>
				</FormProvider>
				<WizardButtons
					onNextClick={onNextClick}
					cancelButton
					onCancelClick={wizard.data.onCancel}
				/>
			</div>
		</WizardStep>
	);
}
