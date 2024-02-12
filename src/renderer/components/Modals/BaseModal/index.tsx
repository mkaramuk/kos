import { BaseModalProps, useViewModel } from "./viewmodel";

export function BaseModal(props: BaseModalProps) {
	const viewModel = useViewModel(props);

	return (
		<div
			className="p-3 bg-white rounded-lg border-2 border-gray-300 flex items-center justify-center"
			ref={viewModel.ref}
		>
			{props.children}
		</div>
	);
}
