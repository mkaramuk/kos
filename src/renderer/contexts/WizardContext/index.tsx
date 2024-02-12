import { WizardStepProps } from "@/renderer/components/Wizard/WizardStep/viewmodel";
import {
	Children,
	Dispatch,
	ReactElement,
	ReactNode,
	SetStateAction,
	cloneElement,
	createContext,
	useState,
} from "react";

export interface WizardContextType<T> {
	data: T;
	currentStepName: string;
	currentStepIndex: number;
	nextEnabled: boolean;
	previousEnabled: boolean;
	setData: Dispatch<SetStateAction<T>>;
	goToNamedStep: (stepName: string) => Promise<void>;
	goToStep: (stepIndex: number) => Promise<void>;
	nextStep: () => Promise<void>;
	previousStep: () => Promise<void>;
	changeNextEnable: (enabled: boolean) => Promise<void>;
	changePreviousEnable: (enabled: boolean) => Promise<void>;
}

export const WizardContext = createContext<WizardContextType<any> | any>({});

export interface WizardProviderProps<T> {
	children?: ReactElement<WizardStepProps> | ReactElement<WizardStepProps>[];
	defaultValue: T;
}

export function WizardProvider<T>(props: WizardProviderProps<T>) {
	if (!props.children || Children.count(props.children) == 0) {
		throw new Error("Wizard must have at least one step");
	}

	const steps = Children.map(props.children, (elem, index) => {
		return cloneElement(elem, {
			name: elem.props?.name ?? index.toString(),
			...elem.props,
		});
	});

	const [data, setData] = useState<T>(props.defaultValue);
	const [currentStepName, setCurrentStepName] = useState<string>(
		steps[0].props.name ?? "0"
	);
	const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
	const [nextEnabled, setNextEnabled] = useState<boolean>(true);
	const [previousEnabled, setPreviousEnabled] = useState<boolean>(false);

	return (
		<WizardContext.Provider
			value={
				{
					currentStepIndex,
					currentStepName,
					data,
					nextEnabled,
					previousEnabled,
					setData,
					async goToStep(stepIndex) {
						if (stepIndex > steps.length || stepIndex < 0) {
							console.error("Invalid step index:", stepIndex);
							return;
						}

						await setCurrentStepName(steps[stepIndex].props.name);
						await setCurrentStepIndex(stepIndex);
					},
					async goToNamedStep(stepName) {
						const index = steps.findIndex(
							(x) => x.props.name == stepName
						);
						if (index == -1) {
							return;
						}

						await setCurrentStepName(stepName);
						await setCurrentStepIndex(index);
					},
					async nextStep() {
						if (!nextEnabled) return;

						const nextIndex = currentStepIndex + 1;
						if (nextIndex == steps.length) {
							return;
						}

						await setCurrentStepName(steps[nextIndex].props.name);
						await setCurrentStepIndex(nextIndex);
					},
					async previousStep() {
						if (!previousEnabled) return;

						const previousIndex = currentStepIndex - 1;
						if (previousIndex < 0) {
							return;
						}

						await setCurrentStepName(
							steps[previousIndex].props.name
						);
						await setCurrentStepIndex(previousIndex);
					},
					async changeNextEnable(enabled) {
						await setNextEnabled(enabled);
					},
					async changePreviousEnable(enabled) {
						await setPreviousEnabled(enabled);
					},
				} satisfies WizardContextType<T>
			}
		>
			{steps}
		</WizardContext.Provider>
	);
}
