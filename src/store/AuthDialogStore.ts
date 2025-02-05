import {create} from 'zustand'

type AuthDialogStore = {
    isOpen: boolean;
    openDialog: () => void;
    closeDialog: () => void;
};

export const useAuthDialogStore = create<AuthDialogStore>((set) => ({
    isOpen: false,
    openDialog: () => set({isOpen: true}),
    closeDialog: () => set({isOpen: false})
}))
