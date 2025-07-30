import { useState, useEffect } from 'react';
import { AppState, ConversationMessage } from '../types/index.js';
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
  showWelcome: true,
  conversationHistory: [],
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
    setState(prev => ({
      ...prev,
      input: '',
      cursorPosition: 0,
      isExecuting: true
    }));
  };

  const completeExecution = (responseText: string) => {
    setState(prev => ({
      ...prev,
      isExecuting: false,
      responseText,
      isStreaming: false,
      streamingText: ''
    }));
  };

  const completeExecutionWithHistory = (responseText: string, service?: 'claude' | 'gemini' | 'codex') => {
    // Add to conversation history and complete execution
    if (service) {
      addAssistantMessage(responseText, service);
    } else {
      addAssistantMessage(responseText);
    }
    completeExecution(responseText);
  };

  const addUserMessage = (content: string) => {
    const message: ConversationMessage = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    };
    setState(prev => ({
      ...prev,
      conversationHistory: [...prev.conversationHistory, message]
      // Keep showWelcome: true so tips always stay visible
    }));
  };

  const addAssistantMessage = (content: string, service?: 'claude' | 'gemini' | 'codex') => {
    // Detect system messages based on content patterns
    const isSystemMessage = content.includes('configured successfully') || 
                            content.includes('logged out from all services') ||
                            content.includes('model set to:') ||
                            content.includes('Please enter a valid API key') ||
                            content.includes('No AI provider configured yet') ||
                            content.startsWith('Usage:');
    
    const message: ConversationMessage = {
      id: Date.now().toString(),
      type: isSystemMessage ? 'system' : 'assistant',
      content,
      service,
      timestamp: new Date()
    };
    setState(prev => ({
      ...prev,
      conversationHistory: [...prev.conversationHistory, message]
    }));
  };

  return {
    state,
    updateState,
    resetInput,
    startExecution,
    completeExecution,
    completeExecutionWithHistory,
    addUserMessage,
    addAssistantMessage
  };
};