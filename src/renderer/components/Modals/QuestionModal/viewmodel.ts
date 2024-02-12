import { ReactNode } from "react";
import { BaseModalProps } from "../BaseModal/viewmodel";

export interface Choice {
	label: ReactNode;
	onClick: () => void;
}

export interface QuestionModalProps extends BaseModalProps {
	question: ReactNode;
	title?: ReactNode;
	choices: Choice[];
}
