import { RoundedButton } from "@/renderer/components/UI/RoundedButton";
import { ClusterCard } from "./ClusterCard";
import { useViewModel } from "./viewmodel";
import { Topbar } from "@/renderer/layout/Topbar";

export function HomePage() {
	const vm = useViewModel();

	return (
		<div className="h-screen w-screen flex flex-col gap-3">
			<Topbar>
				<RoundedButton onClick={vm.onAddClusterClick}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="27"
						height="27"
						viewBox="0 0 24 24"
					>
						<g
							fill="currentColor"
							fillRule="evenodd"
							clipRule="evenodd"
						>
							<path d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12m10-8a8 8 0 1 0 0 16a8 8 0 0 0 0-16" />
							<path d="M13 7a1 1 0 1 0-2 0v4H7a1 1 0 1 0 0 2h4v4a1 1 0 1 0 2 0v-4h4a1 1 0 1 0 0-2h-4z" />
						</g>
					</svg>
					<span>Add Management Cluster</span>
				</RoundedButton>
			</Topbar>

			<div className="flex flex-wrap gap-3 px-[50px] py-[30px]">
				{vm.clusters.map((x, i) => (
					<ClusterCard
						onClusterRemoved={vm.loadClusters}
						key={i}
						{...x}
					/>
				))}
			</div>
		</div>
	);
}
