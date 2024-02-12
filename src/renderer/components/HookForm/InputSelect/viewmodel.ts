import { ComponentProps, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import type Select from "react-select";

export interface InputSelectProps extends ComponentProps<Select> {
	name: string;
}

export function useViewModel(props: InputSelectProps) {
	const { setValue } = useFormContext();

	useEffect(() => {
		if (props.options?.length == 0) {
			setValue(props.name, null);
		} else {
			setValue(props.name, props.options?.[0] ?? null);
		}
	}, [props.options]);
}
