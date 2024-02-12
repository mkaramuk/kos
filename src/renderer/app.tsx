import { Redirect, Route, Switch } from "wouter";
import "./index.css";
import { HomePage } from "./pages/Home";
import { createRoot } from "react-dom/client";
import { ModalController } from "@/renderer/controllers/ModalController";
import { ToastContainer } from "react-toastify";
import { ExecutableController } from "@/renderer/controllers/ExecutableController";
import "react-toastify/dist/ReactToastify.css";
import { ManagementClusterPage } from "@/renderer/pages/ManagementCluster";
import { ClusterPage } from "@/renderer/pages/Cluster";

const root = createRoot(document.getElementById("root"));
root.render(
	<>
		<ToastContainer pauseOnFocusLoss={false} position="bottom-right" />
		<ExecutableController />
		<ModalController />
		<Switch>
			<Route path="/">
				<Redirect to="/management-clusters" />
			</Route>
			<Route path="/management-clusters" component={HomePage} />
			<Route
				path="/management-clusters/:clusterName"
				component={({ params }: any) => (
					<Redirect
						to={`/management-clusters/${params.clusterName}/clusters`}
					/>
				)}
			/>
			<Route
				path="/management-clusters/:clusterName/clusters"
				component={ManagementClusterPage}
			/>
			<Route
				path="/management-clusters/:mClusterName/clusters/:clusterName"
				component={ClusterPage}
			/>
		</Switch>
	</>
);
