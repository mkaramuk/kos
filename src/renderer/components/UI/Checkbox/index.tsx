import { InputHTMLAttributes, forwardRef } from "react";

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
	label?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
	(props: CheckboxProps, ref) => {
		return (
			<div className="flex items-center mb-4 hover:cursor-pointer">
				<input
					ref={ref}
					{...props}
					type="checkbox"
					className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 hover:cursor-pointer"
				/>
				<label
					htmlFor={props.id}
					className="ms-2 text-sm font-medium hover:cursor-pointer"
				>
					{props.label}
				</label>
			</div>
		);
	}
);
