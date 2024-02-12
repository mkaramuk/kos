import { Link } from "wouter";
import { TopbarProps, useViewModel } from "./viewmodel";
import { RoundedButton } from "@/renderer/components/UI/RoundedButton";

export function Topbar(props: TopbarProps) {
	const vm = useViewModel(props);

	return (
		<div className="w-screen flex flex-col">
			<div className="w-full h-[70px] bg-blue-500 flex items-center px-5 justify-between">
				{vm.backButtonVisible ? (
					<RoundedButton onClick={vm.onBackClick}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
						>
							<path
								fill="currentColor"
								d="m4 10l-.707.707L2.586 10l.707-.707zm17 8a1 1 0 1 1-2 0zM8.293 15.707l-5-5l1.414-1.414l5 5zm-5-6.414l5-5l1.414 1.414l-5 5zM4 9h10v2H4zm17 7v2h-2v-2zm-7-7a7 7 0 0 1 7 7h-2a5 5 0 0 0-5-5z"
							/>
						</svg>
					</RoundedButton>
				) : (
					<div></div>
				)}
				<div className="flex items-center h-full">{props.children}</div>
			</div>
			<div className="flex gap-1 w-full font-bold font-mono justify-center">
				{vm.location.slice(1).map((x, i) => (
					<Link
						key={i}
						className="text-blue-500"
						href={`${vm.location.slice(0, i + 2).join("/")}`}
					>
						{x}
						{i != vm.location.length - 2 ? " / " : ""}
					</Link>
				))}
			</div>
		</div>
	);
}
