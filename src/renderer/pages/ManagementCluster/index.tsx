import { Topbar } from "@/renderer/layout/Topbar";
import { ManagementClusterPageProps, useViewModel } from "./viewmodel";
import { Children, ReactNode } from "react";
import { ProviderIcon } from "@/renderer/components/UI/ProviderIcon";
import { RoundedButton } from "@/renderer/components/UI/RoundedButton";
import { Menu, MenuItem, MenuButton } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import { Loading } from "@/renderer/components/UI/Loading";
import { twMerge } from "tailwind-merge";

function Row(props: { children?: ReactNode; onClick?: () => void }) {
	return (
		<tr className="transition-all duration-200 hover:cursor-pointer hover:bg-gray-100">
			{Children.map(props.children, (val, rowID) => (
				<td
					onClick={
						rowID != Children.count(props.children) - 1
							? props.onClick
							: undefined
					}
					className="border-b py-3 px-3"
					key={rowID}
				>
					{val}
				</td>
			))}
		</tr>
	);
}

function Table(props: {
	heading: string[];
	body: any[];
	onClick?: (row: any[]) => void;
	onCreateClusterClick?: () => void;
}) {
	function renderTable() {
		if (props.body.length == 0) {
			return (
				<div className="flex w-full items-center justify-center flex-col gap-3">
					<div className="text-gray-400">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="64"
							height="64"
							viewBox="0 0 24 24"
						>
							<path
								fill="none"
								stroke="currentColor"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M7 2h13a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-5m-5 0L2.5 2.5C2 2 2 2.5 2 5v3a2 2 0 0 0 2 2zm12 7v-1a2 2 0 0 0-2-2h-1M4 14a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16.5l1-.5l.5.5l-8-8zm2 4h.01M2 2l20 20"
							/>
						</svg>
					</div>
					<div className="italic text-gray-500">
						There are not any clusters. You can{" "}
						<span
							className={twMerge(
								"text-blue-400 underline",
								"hover:cursor-pointer"
							)}
							onClick={props.onCreateClusterClick}
						>
							create one
						</span>
						.
					</div>
				</div>
			);
		}

		return (
			<div className="border-2 w-full">
				<table className="">
					<thead>
						<tr>
							{props.heading.map((head, headID) => (
								<th
									className="p-3 text-start border-b"
									key={headID}
								>
									{head}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{props.body.map((rowContent, rowID) => (
							<Row
								onClick={() => props.onClick?.(rowContent)}
								key={rowID}
							>
								{rowContent}
							</Row>
						))}
					</tbody>
				</table>
			</div>
		);
	}

	return (
		<div className="w-[50%] overflow-hidden rounded-lg self-center">
			{renderTable()}
		</div>
	);
}

export function ManagementClusterPage(props: ManagementClusterPageProps) {
	const vm = useViewModel(props);

	return (
		<div className="h-screen w-screen flex flex-col gap-3">
			<Topbar backLocation="/management-clusters">
				<RoundedButton onClick={vm.onCreateClusterClick}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
					>
						<path
							fill="currentColor"
							d="M10 13H4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1m-1 6H5v-4h4ZM20 3h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1m-1 6h-4V5h4Zm1 7h-2v-2a1 1 0 0 0-2 0v2h-2a1 1 0 0 0 0 2h2v2a1 1 0 0 0 2 0v-2h2a1 1 0 0 0 0-2M10 3H4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1M9 9H5V5h4Z"
						/>
					</svg>
					<span>Create Cluster</span>
				</RoundedButton>
			</Topbar>
			{vm.loading ? (
				<Loading />
			) : (
				<>
					<Table
						onCreateClusterClick={vm.onCreateClusterClick}
						onClick={(e) => vm.onClusterClick(e[0])}
						heading={[
							"Name",
							"Provider",
							"Master",
							"Worker",
							"Ready",
							"Status",
							"Actions",
						]}
						body={vm.clusters.map((x, i) => [
							x.name,
							<ProviderIcon key={i} provider={x.provider} />,
							x.masterCount,
							x.workerCount,
							<div
								key={i}
								className={`flex gap-1 ${
									x.readyStates.filter((x) => x).length ==
									x.readyStates.length
										? "text-green-600"
										: "text-red-600"
								}`}
							>
								<div>
									{x.readyStates.filter((x) => x).length}
								</div>
								/<div>{x.readyStates.length}</div>
							</div>,
							x.status,
							<Menu
								key={i}
								menuStyle={{
									padding: 0,
								}}
								menuButton={
									<MenuButton className="text-black">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="32"
											height="32"
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
									disabled={x.status != "Provisioned"}
									onClick={() =>
										vm.onSaveKubeconfigClick(x.name)
									}
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
											d="m13.691 15.778l-.63-.49a2.29 2.29 0 0 0 .023-.288a1.548 1.548 0 0 0-.024-.289l.625-.49a.153.153 0 0 0 .036-.188l-.59-1.02a.15.15 0 0 0-.183-.065l-.73.295a2.016 2.016 0 0 0-.502-.289l-.112-.778a.14.14 0 0 0-.141-.124h-1.18a.151.151 0 0 0-.147.124l-.112.778a2.355 2.355 0 0 0-.5.29l-.732-.296a.154.154 0 0 0-.183.065l-.59 1.02a.146.146 0 0 0 .036.189l.625.49a2.366 2.366 0 0 0 0 .577l-.625.49a.153.153 0 0 0-.035.188l.59 1.02a.15.15 0 0 0 .182.065l.731-.295a2.016 2.016 0 0 0 .501.289l.112.778a.147.147 0 0 0 .148.124h1.179a.151.151 0 0 0 .147-.124l.112-.778a2.178 2.178 0 0 0 .495-.29l.737.296a.154.154 0 0 0 .183-.065l.59-1.02a.153.153 0 0 0-.036-.189m-2.818.106a.884.884 0 1 1 .885-.884a.883.883 0 0 1-.885.884"
										/>
										<path
											fill="currentColor"
											d="M14 2H6a2.006 2.006 0 0 0-2 2v16a2.006 2.006 0 0 0 2 2h12a2.006 2.006 0 0 0 2-2V8Zm4 18H6V4h7v5h5Z"
										/>
									</svg>
									Save Kubeconfig
								</MenuItem>
								<MenuItem
									disabled={x.status == "Deleting"}
									onClick={() =>
										vm.onDeleteClusterClick(x.name)
									}
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
							</Menu>,
						])}
					/>
				</>
			)}
		</div>
	);
}
