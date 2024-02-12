import { Topbar } from "@/renderer/layout/Topbar";
import { ClusterPageProps, useViewModel } from "./viewmodel";
import { Children, ReactNode } from "react";
import { Loading } from "@/renderer/components/UI/Loading";

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
}) {
	return (
		<div className="w-full overflow-hidden rounded-lg self-center border-2">
			<table className="w-full">
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

export function ClusterPage(props: ClusterPageProps) {
	const vm = useViewModel(props);

	function renderStatus(status: string, key: any) {
		switch (status) {
			case "Running":
				return (
					<div key={key} className="text-green-500">
						{status}
					</div>
				);
		}
		return (
			<div key={key} className="text-purple-500">
				{status}
			</div>
		);
	}

	return (
		<div className="h-screen w-screen flex flex-col gap-3">
			<Topbar></Topbar>

			<div className="flex flex-col items-center w-full h-full px-[50px] py-[30px]">
				<div className="flex w-full gap-5">
					{vm.loading ? (
						<div className="flex w-full flex-col items-center">
							Cluster is loading...
							<Loading />
						</div>
					) : (
						<>
							<div className="flex flex-[0.5] flex-col gap-3">
								<div>Control Planes:</div>
								<Table
									heading={[
										"Name",
										"Ready",
										"Status",
										"Version",
									]}
									body={vm.controlPlanes.map((x, i) => [
										x.name,
										<div
											key={i}
											className={`flex gap-1 ${
												x.ready[0] == x.ready[1]
													? "text-green-600"
													: "text-red-600"
											}`}
										>
											<div>{x.ready[0]}</div>/
											<div>{x.ready[1]}</div>
										</div>,
										renderStatus(x.status, i),
										x.version,
									])}
								/>
							</div>
							<div className="flex flex-[0.5] flex-col gap-3">
								<div>Workers:</div>
								<Table
									heading={[
										"Name",
										"Ready",
										"Status",
										"Version",
									]}
									body={vm.workers.map((x, i) => [
										x.name,
										<div
											key={i}
											className={`flex gap-1 ${
												x.ready[0] == x.ready[1]
													? "text-green-600"
													: "text-red-600"
											}`}
										>
											<div>{x.ready[0]}</div>/
											<div>{x.ready[1]}</div>
										</div>,
										renderStatus(x.status, i),
										x.version,
									])}
								/>
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	);
}
