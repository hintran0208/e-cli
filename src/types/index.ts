export interface AppState {
  input: string;
  showModeSelection: boolean;
  selectedModeIndex: number;
  showToolSelection: boolean;
  selectedToolIndex: number;
  showGeminiSetup: boolean;
  selectedTool: string;
  apiKeyInput: string;
  cursorPosition: number;
  isExecuting: boolean;
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