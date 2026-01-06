import React, { createContext, useContext, ReactNode } from 'react';
import CustomModal from '@/components/ui/CustomModal';
import { useModal, ModalState } from '@/hooks/useModal';

interface ModalContextType {
  showAlert: (message: string, title?: string) => Promise<void>;
  showConfirm: (message: string, title?: string) => Promise<boolean>;
  showPrompt: (message: string, defaultValue?: string, title?: string, placeholder?: string) => Promise<string | null>;
  showInfo: (message: string, title?: string) => Promise<void>;
  showSuccess: (message: string, title?: string) => Promise<void>;
  showWarning: (message: string, title?: string) => Promise<void>;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModalContext = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModalContext must be used within a ModalProvider');
  }
  return context;
};

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const {
    modalState,
    closeModal,
    showAlert,
    showConfirm,
    showPrompt,
    showInfo,
    showSuccess,
    showWarning
  } = useModal();

  const contextValue: ModalContextType = {
    showAlert,
    showConfirm,
    showPrompt,
    showInfo,
    showSuccess,
    showWarning
  };

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
      <CustomModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        title={modalState.title}
        message={modalState.message}
        type={modalState.type}
        defaultValue={modalState.defaultValue}
        placeholder={modalState.placeholder}
        onConfirm={modalState.onConfirm}
        onCancel={modalState.onCancel}
      />
    </ModalContext.Provider>
  );
};
