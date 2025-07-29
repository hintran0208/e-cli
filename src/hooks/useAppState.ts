import { useState, useEffect } from 'react';
import { AppState } from '../types/index.js';
import { StorageService } from '../services/storageService.js';

// Load credentials on app start
const authState = StorageService.loadAndSetEnvironmentVariables();

const initialState: AppState = {
  input: '',
  showModeSelection: false,
  selectedModeIndex: 0,
  showToolSelection: false,
  selectedToolIndex: 0,
  showGeminiSetup: false,
  showClaudeSetup: false,
  showCodexSetup: false,
  selectedTool: '',
  apiKeyInput: '',
  claudeApiKeyInput: '',
  codexApiKeyInput: '',
  cursorPosition: 0,
  isExecuting: false,
  currentService: '',
  responseText: '',
  showResponse: false,
  loadingDots: 0,
  isStreaming: false,
  streamingText: '',
  showCommandDropdown: false,
  selectedCommandIndex: 0,
  isClaudeAuthenticated: authState.isClaudeAuthenticated,
  isGeminiAuthenticated: authState.isGeminiAuthenticated,
  isCodexAuthenticated: authState.isCodexAuthenticated,
  showModelSelection: false,
  selectedModelIndex: 0,
  availableModels: [],
  modelProvider: '',
};

export const useAppState = () => {
  const [state, setState] = useState<AppState>(initialState);

  // Animation for loading dots
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (state.isExecuting) {
      interval = setInterval(() => {
        setState(prev => ({
          ...prev,
          loadingDots: (prev.loadingDots + 1) % 4
        }));
      }, 300);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [state.isExecuting]);

  const updateState = (updates: Partial<AppState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const resetInput = () => {
    updateState({
      input: '',
      cursorPosition: 0
    });
  };

  const startExecution = () => {
    updateState({
      input: '',
      cursorPosition: 0,
      showResponse: false,
      isExecuting: true
    });
  };

  const completeExecution = (responseText: string) => {
    updateState({
      isExecuting: false,
      responseText,
      showResponse: true
    });
  };

  return {
    state,
    updateState,
    resetInput,
    startExecution,
    completeExecution
  };
};