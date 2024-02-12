export type KubectlFlags = {
	outputType?: "json" | "jsonpath" | "plaintext";
	label?: string | string[];
	namespace?: string;
	allNamespaces?: boolean;
};

export type KubectlRunOptions = {
	args: (string | undefined)[];
	env?: any;
	flags?: KubectlFlags;
};

export type KubectlQueryOptions = {
	resource: string;
	name?: string;
	flags?: KubectlFlags;
};

export type KubectlApplyOptions = {
	path?: string;
	content?: string;
	flags?: KubectlFlags;
};

export type KubectlPatchOptions = KubectlQueryOptions & {
	type: "merge" | "json" | "strategic";
	patch?: string | any;
	patchFile?: string;
};
