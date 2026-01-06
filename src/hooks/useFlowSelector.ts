import { useState, useCallback } from 'react';

export interface Flow {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  isDefault?: boolean;
}

export const useFlowSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [onSelectCallback, setOnSelectCallback] = useState<((flowId: string) => void) | null>(null);

  const openFlowSelector = useCallback((onSelect: (flowId: string) => void) => {
    setOnSelectCallback(() => onSelect);
    setIsOpen(true);
  }, []);

  const closeFlowSelector = useCallback(() => {
    setIsOpen(false);
    setOnSelectCallback(null);
  }, []);

  const handleSelectFlow = useCallback((flowId: string) => {
    if (onSelectCallback) {
      onSelectCallback(flowId);
    }
    closeFlowSelector();
  }, [onSelectCallback, closeFlowSelector]);

  return {
    isOpen,
    openFlowSelector,
    closeFlowSelector,
    handleSelectFlow
  };
};
