import { forwardRef } from "react";
import { CSSProperties, ChangeEvent, FocusEventHandler } from "react";

export interface TextFieldProps {
	style?: CSSProperties;
	rows?: number;
	cols?: number;
	value?: string;
	label?: string;
	name?: string;
	type?: "number" | undefined;
	defaultValue?: string;
	className?: string;
	onBlur?: FocusEventHandler<HTMLTextAreaElement | HTMLInputElement>;
	onChange?: (
		event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
	) => void;
}

export const TextField = forwardRef<
	HTMLInputElement & HTMLTextAreaElement,
	TextFieldProps
>((props: TextFieldProps, ref) => {
	const classes =
		"transition-all duration-200 focus-visible:bg-gray-100 border-2 border-gray-200 focus-visible:outline-none py-2 px-3 bg-white rounded-[5px] text-gray-800 w-full resize-none h-fit shadow-sm";
	return (
		<div className="flex flex-col w-full">
			{props.label ? (
				<label className="text-black">{props.label}</label>
			) : null}
			{props.rows ? (
				<textarea
					onBlur={props.onBlur}
					ref={ref}
					name={props.name}
					value={props.value}
					className={classes}
					cols={props.cols}
					rows={props.rows}
					style={props.style}
					onChange={props.onChange}
					defaultValue={props.defaultValue}
				/>
			) : (
				<input
					ref={ref}
					onBlur={props.onBlur}
					onChange={props.onChange}
					defaultValue={props.defaultValue}
					value={props.value}
					style={props.style}
					className={classes}
					type={props.type}
					name={props.name}
				/>
			)}
		</div>
	);
});
