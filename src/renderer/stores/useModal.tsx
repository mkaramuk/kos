import { BaseModalProps } from "@/renderer/components/Modals/BaseModal/viewmodel";
import { ComponentType, ReactElement } from "react";
import { create } from "zustand";

interface ModalItem {
	id: string;
	modal: ReactElement<BaseModalProps>;
}

interface ModalOptions<T extends BaseModalProps> {
	id?: string;
	persist?: boolean;
	props?: T;
}

interface ModalStore {
	modals: ModalItem[];
	openModal: <T extends BaseModalProps>(
		Modal: ComponentType<T>,
		options?: ModalOptions<T>
	) => string;
	closeModal: (options?: { key?: string; timeout?: number }) => Promise<void>;
}

export const useModal = create<ModalStore>((set) => ({
	modals: [],
	openModal<T extends BaseModalProps>(
		Modal: ComponentType<T>,
		options?: ModalOptions<T>
	) {
		const id =
			options?.id ??
			Date.now().toString(36) + Math.random().toString(36).substring(4);

		set(({ modals, closeModal }) => {
			return {
				modals: [
					...modals,
					{
						id,
						modal: (
							<Modal
								id={id}
								{...options?.props}
								onClose={() => {
									options.props?.onClose?.();
									if (!options.persist) {
										closeModal({ key: id });
									}
								}}
							/>
						),
					},
				],
			};
		});

		return id;
	},
	async closeModal(options?: { key?: string; timeout?: number }) {
		if (options?.timeout) {
			await new Promise((res) => setTimeout(res, options?.timeout));
		}

		set(({ modals }) => {
			if (!options?.key) {
				return {
					modals: [],
				};
			}
			return {
				modals: modals.filter((x) => x.id != options?.key),
			};
		});
	},
}));
