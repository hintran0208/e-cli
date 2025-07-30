export interface AppState {
  input: string;
  showModeSelection: boolean;
  selectedModeIndex: number;
  showToolSelection: boolean;
  selectedToolIndex: number;
  showGeminiSetup: boolean;
  showClaudeSetup: boolean;
  showCodexSetup: boolean;
  selectedTool: string;
  apiKeyInput: string;
  claudeApiKeyInput: string;
  codexApiKeyInput: string;
  cursorPosition: number;
  isExecuting: boolean;
  currentService: 'claude' | 'gemini' | 'codex' | '';
  responseText: string;
  loadingDots: number;
  isStreaming: boolean;
  streamingText: string;
  showCommandDropdown: boolean;
  selectedCommandIndex: number;
  isClaudeAuthenticated: boolean;
  isGeminiAuthenticated: boolean;
  isCodexAuthenticated: boolean;
  showModelSelection: boolean;
  selectedModelIndex: number;
  availableModels: string[];
  modelProvider: 'claude' | 'gemini' | 'codex' | '';
  showWelcome: boolean;
  conversationHistory: ConversationMessage[];
}

export interface Command {
  name: string;
  description: string;
  action: string;
}

export interface GeminiCommand {
  type: 'prompt' | 'cli';
  content: string;
}

export interface CodexCommand {
  type: 'prompt' | 'cli';
  content: string;
}

export interface ProcessResult {
  success: boolean;
  output: string;
  error?: string;
}

export interface ConversationMessage {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  service?: 'claude' | 'gemini' | 'codex';
  timestamp: Date;
}