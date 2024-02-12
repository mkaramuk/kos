import { TextField, TextFieldProps } from "@/renderer/components/UI/TextField";
import { Controller, useFormContext } from "react-hook-form";

export function InputTextField({
	name,
	defaultValue,
	...props
}: TextFieldProps & { name: string; inputName?: string }) {
	const { control } = useFormContext();

	return (
		<Controller
			name={name}
			control={control}
			defaultValue={defaultValue ?? ""}
			render={({ field, fieldState: { error } }) => (
				<div className="flex flex-col gap-1">
					<TextField {...field} {...props} name={props.inputName} />
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
