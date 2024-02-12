import { WizardButtonsProps, useViewModel } from "./viewmodel";

export function WizardButtons(props: WizardButtonsProps) {
	const vm = useViewModel(props);

	return (
		<div className="flex flex-col gap-2">
			<hr />
			<div className="w-full flex justify-between">
				{props.cancelButton === true || !!props.cancelButton ? (
					<button
						onClick={props.onCancelClick}
						disabled={
							props.cancelEnabled
								? !props.cancelEnabled
								: undefined
						}
						className="disabled:bg-white disabled:text-gray-400 hover:bg-gray-200 border-2 rounded-lg px-3 py-1 bg-gray-100"
					>
						Cancel
					</button>
				) : (
					<div></div>
				)}
				<div className="flex gap-2">
					<button
						onClick={vm.onBackClick}
						disabled={!vm.wizard.previousEnabled}
						className="disabled:bg-white disabled:text-gray-400 hover:bg-gray-200 border-2 rounded-lg px-3 py-1 bg-gray-100"
					>
						Back
					</button>
					<button
						onClick={vm.onNextClick}
						disabled={!vm.wizard.nextEnabled}
						className="disabled:bg-white disabled:text-gray-400 hover:bg-gray-200 border-2 rounded-lg px-3 py-1 bg-gray-100"
					>
						{props.nextButtonLabel ?? "Next"}
					</button>
				</div>
			</div>
		</div>
	);
}
