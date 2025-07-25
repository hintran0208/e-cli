import { useInput } from 'ink';
import { AppState } from '../types/index.js';
import { GeminiService } from '../services/geminiService.js';
import { ClaudeService } from '../services/claudeService.js';

interface UseInputHandlerProps {
  state: AppState;
  updateState: (updates: Partial<AppState>) => void;
  resetInput: () => void;
  startExecution: () => void;
  completeExecution: (responseText: string) => void;
}

export const useInputHandler = ({
  state,
  updateState,
  resetInput,
  startExecution,
  completeExecution
}: UseInputHandlerProps) => {
  
  useInput(async (inputChar: string, key: any) => {
    if (key.return) {
      if (state.showModeSelection) {
        // Handle mode selection
        if (state.selectedModeIndex === 0) {
          updateState({
            showModeSelection: false,
            showToolSelection: true,
            selectedModeIndex: 0
          });
        } else if (state.selectedModeIndex === 1) {
          updateState({
            showModeSelection: false,
            selectedModeIndex: 0
          });
        }
        resetInput();
      } else if (state.showToolSelection) {
        // Handle tool selection
        const tools = ["Claude Code", "Gemini CLI", "CodeX OpenAI"];
        const selectedToolName = tools[state.selectedToolIndex];
        updateState({ selectedTool: selectedToolName });
        
        if (selectedToolName === "Gemini CLI") {
          updateState({
            showToolSelection: false,
            showGeminiSetup: true
          });
        } else if (selectedToolName === "Claude Code") {
          updateState({
            showToolSelection: false,
            showClaudeSetup: true
          });
        } else {
          updateState({ showToolSelection: false });
          completeExecution(`${selectedToolName} integration coming soon!`);
        }
        updateState({ selectedToolIndex: 0 });
        resetInput();
      } else if (state.showGeminiSetup) {
        // Handle Gemini setup - save API key
        if (state.apiKeyInput.trim()) {
          // Set the API key as environment variable
          process.env.GEMINI_API_KEY = state.apiKeyInput.trim();
          completeExecution("✅ API key saved successfully!\nYou can now use: ecli gemini [your prompt]");
          updateState({
            showGeminiSetup: false,
            apiKeyInput: ""
          });
          resetInput();
        } else {
          completeExecution("❌ Please enter a valid API key");
          resetInput();
        }
      } else if (state.showClaudeSetup) {
        // Handle Claude setup - save API key
        if (state.claudeApiKeyInput.trim()) {
          // Set the API key as environment variable
          process.env.ANTHROPIC_API_KEY = state.claudeApiKeyInput.trim();
          completeExecution("✅ API key saved successfully!\nYou can now use: ecli claude [your prompt] or the interactive mode");
          updateState({
            showClaudeSetup: false,
            claudeApiKeyInput: ""
          });
          resetInput();
        } else {
          completeExecution("❌ Please enter a valid API key");
          resetInput();
        }
      } else {
        // Handle command execution
        const currentInput = state.input.trim();
        if (currentInput === "/mode") {
          updateState({ showModeSelection: true });
          resetInput();
          return;
        } else if (currentInput.startsWith("ecli claude")) {
          const claudeCommand = currentInput.replace("ecli claude", "").trim();
          if (claudeCommand) {
            updateState({ currentService: 'claude' });
            startExecution();
            
            try {
              const parsedCommand = ClaudeService.parseCommand(claudeCommand);
              const result = await ClaudeService.executeCommand(parsedCommand);
              completeExecution(result.output);
            } catch (error) {
              completeExecution(`❌ Unexpected error: ${error}`);
            }
          } else {
            completeExecution('Claude Code ready - Usage:\n• ecli claude "your question here" - for prompts\n• ecli claude /help - for CLI commands');
            resetInput();
          }
          return;
        } else if (currentInput.startsWith("ecli gemini")) {
          if (state.selectedTool === "Gemini CLI") {
            const geminiCommand = currentInput.replace("ecli gemini", "").trim();
            if (geminiCommand) {
              updateState({ currentService: 'gemini' });
              startExecution();
              
              try {
                const parsedCommand = GeminiService.parseCommand(geminiCommand);
                const result = await GeminiService.executeCommand(parsedCommand);
                completeExecution(result.output);
              } catch (error) {
                completeExecution(`❌ Unexpected error: ${error}`);
              }
            } else {
              completeExecution('Gemini CLI ready - Usage:\n• ecli gemini "your question here" - for prompts\n• ecli gemini /help - for CLI commands');
              resetInput();
            }
          } else {
            completeExecution("Please select Gemini CLI first using /mode");
            resetInput();
          }
          return;
        }
        console.log(`Executing: ${currentInput}`);
        process.exit(0);
      }
    } else if (state.showModeSelection && (key.upArrow || key.downArrow)) {
      // Handle arrow key navigation in mode selection
      if (key.upArrow) {
        updateState({ selectedModeIndex: state.selectedModeIndex === 0 ? 1 : 0 });
      } else if (key.downArrow) {
        updateState({ selectedModeIndex: state.selectedModeIndex === 1 ? 0 : 1 });
      }
    } else if (state.showToolSelection && (key.upArrow || key.downArrow)) {
      // Handle arrow key navigation in tool selection
      if (key.upArrow) {
        updateState({ selectedToolIndex: state.selectedToolIndex === 0 ? 2 : state.selectedToolIndex - 1 });
      } else if (key.downArrow) {
        updateState({ selectedToolIndex: state.selectedToolIndex === 2 ? 0 : state.selectedToolIndex + 1 });
      }
    } else if (state.showGeminiSetup && (key.backspace || key.delete)) {
      updateState({ apiKeyInput: state.apiKeyInput.slice(0, -1) });
    } else if (state.showGeminiSetup && inputChar && !key.ctrl && !key.meta) {
      updateState({ apiKeyInput: state.apiKeyInput + inputChar });
    } else if (state.showClaudeSetup && (key.backspace || key.delete)) {
      updateState({ claudeApiKeyInput: state.claudeApiKeyInput.slice(0, -1) });
    } else if (state.showClaudeSetup && inputChar && !key.ctrl && !key.meta) {
      updateState({ claudeApiKeyInput: state.claudeApiKeyInput + inputChar });
    } else if (!state.showModeSelection && !state.showToolSelection && !state.showGeminiSetup && !state.showClaudeSetup && !state.isExecuting && key.leftArrow) {
      updateState({ cursorPosition: Math.max(0, state.cursorPosition - 1) });
    } else if (!state.showModeSelection && !state.showToolSelection && !state.showGeminiSetup && !state.showClaudeSetup && !state.isExecuting && key.rightArrow) {
      updateState({ cursorPosition: Math.min(state.input.length, state.cursorPosition + 1) });
    } else if (!state.showModeSelection && !state.showToolSelection && !state.showGeminiSetup && !state.showClaudeSetup && !state.isExecuting && (key.backspace || key.delete)) {
      if (state.cursorPosition > 0) {
        const newInput = state.input.slice(0, state.cursorPosition - 1) + state.input.slice(state.cursorPosition);
        updateState({
          input: newInput,
          cursorPosition: state.cursorPosition - 1
        });
      }
    } else if (!state.showModeSelection && !state.showToolSelection && !state.showGeminiSetup && !state.showClaudeSetup && !state.isExecuting && inputChar && !key.ctrl && !key.meta) {
      const newInput = state.input.slice(0, state.cursorPosition) + inputChar + state.input.slice(state.cursorPosition);
      updateState({
        input: newInput,
        cursorPosition: state.cursorPosition + 1
      });
    }
  });
};