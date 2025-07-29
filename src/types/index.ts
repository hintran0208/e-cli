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
  showResponse: boolean;
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