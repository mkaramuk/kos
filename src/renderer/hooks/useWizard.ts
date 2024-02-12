import {
	WizardContext,
	WizardContextType,
} from "@/renderer/contexts/WizardContext";
import { useContext } from "react";

export function useWizard<T>() {
	return useContext(WizardContext) as WizardContextType<T>;
}
