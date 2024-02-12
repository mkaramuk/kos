import { Checkbox, CheckboxProps } from "@/renderer/components/UI/Checkbox";
import { Controller, useFormContext } from "react-hook-form";

export function InputCheckbox({
	name,
	defaultValue,
	...props
}: CheckboxProps & { name: string }) {
	const { control } = useFormContext();

	return (
		<Controller
			name={name}
			control={control}
			defaultValue={defaultValue}
			render={({ field: { value, ...rest }, fieldState: { error } }) => (
				<div className="flex flex-col gap-1">
					<Checkbox checked={value} {...rest} {...props} id={name} />
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
