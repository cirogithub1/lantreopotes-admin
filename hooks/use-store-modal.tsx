import { create } from 'zustand'

interface ModalStoreProps {
	isOpen: boolean
	onOpen: () => void
	onClose: () => void
}

export const useStoreModal = create<ModalStoreProps>((set) => ({
	isOpen: false,
	onOpen: () => set({ isOpen: true }),
	onClose: () => set({ isOpen: false }),
}))