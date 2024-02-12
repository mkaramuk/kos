import { ProviderIcon } from "@/renderer/components/UI/ProviderIcon";
import { ClusterCardProps, useViewModel } from "./viewmodel";
import { Menu, MenuItem, MenuButton } from "@szhsin/react-menu";
import { InfrastructureLabel } from "@/renderer/models/InfrastructureLabel.enum";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";

export function ClusterCard(props: ClusterCardProps) {
	const vm = useViewModel(props);

	function renderLoading() {
		if (vm.loading) {
			return (
				<div className="w-full">
					<div className="h-1.5 w-full bg-pink-100 overflow-hidden">
						<div className="progress w-full h-full bg-blue-500 left-right"></div>
					</div>
				</div>
			);
		}
	}

	return (
		<div
			onClick={vm.onClick}
			className="hover:cursor-pointer transition-all duration-200 hover:bg-gray-100 p-3 border-2 rounded-lg w-[300px] h-[200px] flex flex-col gap-2"
		>
			<div className="flex justify-between font-bold w-full text-[20px]">
				{props.name}
				<Menu
					onClick={(e) => e.stopPropagation()}
					className="font-normal"
					menuStyle={{
						padding: 0,
					}}
					menuButton={
						<MenuButton
							onClick={(e) => e.stopPropagation()}
							className="transition-all duration-200 hover:text-blue-500 text-black"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="28"
								height="28"
								viewBox="0 0 256 256"
							>
								<path
									fill="currentColor"
									d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24m0 192a88 88 0 1 1 88-88a88.1 88.1 0 0 1-88 88m12-88a12 12 0 1 1-12-12a12 12 0 0 1 12 12m44 0a12 12 0 1 1-12-12a12 12 0 0 1 12 12m-88 0a12 12 0 1 1-12-12a12 12 0 0 1 12 12"
								/>
							</svg>
						</MenuButton>
					}
					transition
				>
					<MenuItem
						onClick={(e) => {
							e.stopPropagation = true;
							vm.onDeleteClusterClick();
						}}
						className="h-[50px] flex items-center gap-2"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
						>
							<path
								fill="currentColor"
								d="M7.615 20q-.67 0-1.143-.472Q6 19.056 6 18.385V6H5V5h4v-.77h6V5h4v1h-1v12.385q0 .69-.462 1.152q-.463.463-1.153.463zM17 6H7v12.385q0 .269.173.442t.442.173h8.77q.23 0 .423-.192q.192-.193.192-.423zM9.808 17h1V8h-1zm3.384 0h1V8h-1zM7 6v13z"
							/>
						</svg>
						Delete
					</MenuItem>
				</Menu>
			</div>
			<hr />
			{renderLoading()}
			<div className="flex flex-col gap-2">
				{vm.info.supportedProviders.slice(0, 3).map((x, i) => (
					<div className="flex flex-col gap-1" key={i}>
						<div className="flex items-center gap-3">
							<ProviderIcon provider={x} />{" "}
							{InfrastructureLabel[x]}
						</div>
						<hr />
					</div>
				))}
				{vm.info.supportedProviders.length > 3 && (
					<div>... and more</div>
				)}
			</div>
		</div>
	);
}
