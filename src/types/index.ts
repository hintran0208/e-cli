export interface AppState {
  input: string;
  showModeSelection: boolean;
  selectedModeIndex: number;
  showToolSelection: boolean;
  selectedToolIndex: number;
  showGeminiSetup: boolean;
  showClaudeSetup: boolean;
  selectedTool: string;
  apiKeyInput: string;
  claudeApiKeyInput: string;
  cursorPosition: number;
  isExecuting: boolean;
  currentService: 'claude' | 'gemini' | '';
  responseText: string;
  showResponse: boolean;
  loadingDots: number;
}

export interface GeminiCommand {
  type: 'prompt' | 'cli';
  content: string;
}

export interface ProcessResult {
  success: boolean;
  output: string;
  error?: string;
}