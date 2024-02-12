import { BaseModal } from "@/renderer/components/Modals/BaseModal";
import {
	Choice,
	QuestionModalProps,
} from "@/renderer/components/Modals/QuestionModal/viewmodel";

export function YesNoChoices(
	onYesClick: () => void,
	onNoClick: () => void
): Choice[] {
	return [
		{
			label: "Yes",
			onClick: onYesClick,
		},
		{
			label: "No",
			onClick: onNoClick,
		},
	];
}

export function QuestionModal(props: QuestionModalProps) {
	return (
		<BaseModal {...props}>
			<div className="w-[500px] gap-3 flex flex-col">
				{props.title && (
					<>
						<h1 className="text-[20px] font-bold">{props.title}</h1>
						<hr />
					</>
				)}
				<p>{props.question}</p>
				<hr />
				<div className="flex flex-row-reverse gap-2">
					{props.choices.map((x, i) => (
						<button
							key={i}
							onClick={x.onClick}
							className=" hover:bg-gray-200 border-2 rounded-lg px-3 py-1 bg-gray-100"
						>
							{x.label}
						</button>
					))}
				</div>
			</div>
		</BaseModal>
	);
}
