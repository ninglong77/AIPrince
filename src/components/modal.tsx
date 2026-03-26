import { ReactNode } from "react";
import { create } from "zustand";

export interface ModalProps {
  title: string;
  content: React.ReactNode;
  comfirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onClose?: () => void;
}

export interface ModalManager {
  modals: ModalProps[];
  open: (props: ModalProps) => void;
  pop: () => void;
}

export const useModals = create<ModalManager>((set) => ({
  open: (props) =>
    set((state) => ({
      modals: [...state.modals, props],
    })),  
  pop: () => set((state) => ({ modals: state.modals.slice(1) })),
  modals: [],
}));

function Modal({ title, content, onConfirm, onClose, confirmText = "Confirm", cancelText = "Cancel" }: { title: string; content: ReactNode; onConfirm?: () => void; onClose?: () => void, confirmText?: string, cancelText?: string }) {
  return <>
    <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-gray-800/50 transition-opacity" onClick={onClose}></div>
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6 border border-gray-200 transform transition-all">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>
              <p className="text-gray-600 mb-6">
                {content}
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={onClose}
                  className="cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                >
                  {cancelText}
                </button>
                <button
                  onClick={onConfirm}
                  className="cursor-pointer bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  {confirmText}
                </button>
              </div>
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
  </>
}

export function ModalRoot() {
  const { modals, pop } = useModals();
  return <>
    {modals.map((modal, index) => (<Modal key={index} {...modal} onClose={() => {
      modal.onClose && modal.onClose()
      pop()
    }} onConfirm={() => {
      modal.onConfirm && modal.onConfirm()
      pop()
    }}/>))}
  </>
}
