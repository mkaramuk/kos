import { Controller, useFormContext } from "react-hook-form";
import { InputSelectProps, useViewModel } from "./viewmodel";
import Select from "react-select";

export function InputSelect({ defaultValue, ...props }: InputSelectProps) {
	const { control } = useFormContext();
	useViewModel(props);

	return (
		<Controller
			name={props.name}
			control={control}
			defaultValue={defaultValue ?? props.options?.[0]}
			render={({ field, fieldState: { error } }) => (
				<div className="flex flex-col gap-2">
					<Select {...field} {...props} />
					{error && (
						<div className="text-red-500 text-[14px] font-thin italic">
							{error?.message}
						</div>
					)}
				</div>
			)}
		/>
	);
}
