import { useState, useCallback } from 'react';

export const useApiKey = () => {
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);

  const validateApiKey = useCallback(async () => {
    // Always return true as requested by user to not require API key UI
    return true;
  }, []);

  const handleApiKeyDialogContinue = useCallback(async () => {
    // No-op
    setShowApiKeyDialog(false);
  }, []);

  return {
    showApiKeyDialog,
    setShowApiKeyDialog,
    validateApiKey,
    handleApiKeyDialogContinue
  };
};
