import { Kubectl } from "@/main/service/executable/Kubectl";

export function check() {
	const kubectl = new Kubectl();
	return kubectl.isExists();
}
