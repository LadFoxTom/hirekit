import { useState, useCallback } from 'react';

export interface ModalState {
  isOpen: boolean;
  title?: string;
  message: string;
  type: 'alert' | 'confirm' | 'prompt' | 'info' | 'success' | 'warning';
  defaultValue?: string;
  placeholder?: string;
  onConfirm?: (value?: string) => void;
  onCancel?: () => void;
}

export const useModal = () => {
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    message: '',
    type: 'alert'
  });

  const closeModal = useCallback(() => {
    setModalState(prev => ({ ...prev, isOpen: false }));
  }, []);

  const showAlert = useCallback((message: string, title?: string) => {
    return new Promise<void>((resolve) => {
      setModalState({
        isOpen: true,
        title,
        message,
        type: 'alert',
        onConfirm: () => {
          resolve();
        }
      });
    });
  }, []);

  const showConfirm = useCallback((message: string, title?: string) => {
    return new Promise<boolean>((resolve) => {
      setModalState({
        isOpen: true,
        title,
        message,
        type: 'confirm',
        onConfirm: () => {
          resolve(true);
        },
        onCancel: () => {
          resolve(false);
        }
      });
    });
  }, []);

  const showPrompt = useCallback((
    message: string, 
    defaultValue: string = '', 
    title?: string,
    placeholder?: string
  ) => {
    return new Promise<string | null>((resolve) => {
      setModalState({
        isOpen: true,
        title,
        message,
        type: 'prompt',
        defaultValue,
        placeholder,
        onConfirm: (value) => {
          resolve(value || null);
        },
        onCancel: () => {
          resolve(null);
        }
      });
    });
  }, []);

  const showInfo = useCallback((message: string, title?: string) => {
    return new Promise<void>((resolve) => {
      setModalState({
        isOpen: true,
        title,
        message,
        type: 'info',
        onConfirm: () => {
          resolve();
        }
      });
    });
  }, []);

  const showSuccess = useCallback((message: string, title?: string) => {
    return new Promise<void>((resolve) => {
      setModalState({
        isOpen: true,
        title,
        message,
        type: 'success',
        onConfirm: () => {
          resolve();
        }
      });
    });
  }, []);

  const showWarning = useCallback((message: string, title?: string) => {
    return new Promise<void>((resolve) => {
      setModalState({
        isOpen: true,
        title,
        message,
        type: 'warning',
        onConfirm: () => {
          resolve();
        }
      });
    });
  }, []);

  return {
    modalState,
    closeModal,
    showAlert,
    showConfirm,
    showPrompt,
    showInfo,
    showSuccess,
    showWarning
  };
};
