import { useModal } from "@/renderer/stores/useModal";

export function ModalController() {
	const { modals } = useModal();

	return modals.length > 0 ? (
		<div
			onClick={() => {}}
			className="w-screen h-screen bg-black/10 absolute top-0 left-0"
		>
			{modals.map((x) => (
				<div
					key={x.id}
					className="w-screen h-screen absolute top-0 left-0 flex items-center justify-center"
				>
					{x.modal}
				</div>
			))}
		</div>
	) : (
		<></>
	);
}
