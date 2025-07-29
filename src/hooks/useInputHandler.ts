import { useInput } from 'ink';
import { AppState } from '../types/index.js';
import { GeminiService } from '../services/geminiService.js';
import { ClaudeService } from '../services/claudeService.js';
import { CodexService } from '../services/codexService.js';
import { availableCommands } from '../config/commands.js';
import { StorageService } from '../services/storageService.js';
import { getModelsForProvider } from '../config/models.js';

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
  
  const handleModelCommand = () => {
    // Determine which providers are available and prioritize
    const authenticatedProviders = [];
    if (state.isClaudeAuthenticated) authenticatedProviders.push('claude');
    if (state.isGeminiAuthenticated) authenticatedProviders.push('gemini');
    if (state.isCodexAuthenticated) authenticatedProviders.push('codex');

    if (authenticatedProviders.length === 0) {
      completeExecution("❌ No AI provider configured. Please run /setup first.");
    } else if (authenticatedProviders.length === 1) {
      // Only one provider configured
      const provider = authenticatedProviders[0] as 'claude' | 'gemini' | 'codex';
      const models = getModelsForProvider(provider);
      updateState({
        showModelSelection: true,
        availableModels: models,
        selectedModelIndex: 0,
        modelProvider: provider
      });
    } else {
      // Multiple providers - default to first available (Claude > Gemini > Codex)
      const provider = authenticatedProviders[0] as 'claude' | 'gemini' | 'codex';
      const models = getModelsForProvider(provider);
      updateState({
        showModelSelection: true,
        availableModels: models,
        selectedModelIndex: 0,
        modelProvider: provider
      });
    }
    resetInput();
  };
  
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
      } else if (state.showModelSelection) {
        // Handle model selection
        const selectedModel = state.availableModels[state.selectedModelIndex];
        if (state.modelProvider === 'claude') {
          StorageService.saveClaudeModel(selectedModel);
          completeExecution(`✅ Claude model set to: ${selectedModel}`);
        } else if (state.modelProvider === 'gemini') {
          StorageService.saveGeminiModel(selectedModel);
          completeExecution(`✅ Gemini model set to: ${selectedModel}`);
        } else if (state.modelProvider === 'codex') {
          StorageService.saveCodexModel(selectedModel);
          completeExecution(`✅ Codex model set to: ${selectedModel}`);
        }
        updateState({ 
          showModelSelection: false,
          selectedModelIndex: 0,
          availableModels: [],
          modelProvider: ''
        });
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
        } else if (selectedToolName === "CodeX OpenAI") {
          updateState({
            showToolSelection: false,
            showCodexSetup: true
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
          // Save the API key persistently
          StorageService.saveGeminiApiKey(state.apiKeyInput.trim());
          updateState({
            showGeminiSetup: false,
            apiKeyInput: "",
            isGeminiAuthenticated: true
          });
          completeExecution("✅ API key saved successfully!\nYou can now use: ecli [your prompt] (defaults to Gemini) or ecli gemini [your prompt]");
          resetInput();
        } else {
          completeExecution("❌ Please enter a valid API key");
          resetInput();
        }
      } else if (state.showClaudeSetup) {
        // Handle Claude setup - save API key
        if (state.claudeApiKeyInput.trim()) {
          // Save the API key persistently
          StorageService.saveAnthropicApiKey(state.claudeApiKeyInput.trim());
          updateState({
            showClaudeSetup: false,
            claudeApiKeyInput: "",
            isClaudeAuthenticated: true
          });
          completeExecution("✅ API key saved successfully!\nYou can now use: ecli [your prompt] (defaults to Claude) or ecli claude [your prompt]");
          resetInput();
        } else {
          completeExecution("❌ Please enter a valid API key");
          resetInput();
        }
      } else if (state.showCodexSetup) {
        // Handle Codex setup - save API key
        if (state.codexApiKeyInput.trim()) {
          // Save the API key persistently
          StorageService.saveOpenAIApiKey(state.codexApiKeyInput.trim());
          updateState({
            showCodexSetup: false,
            codexApiKeyInput: "",
            isCodexAuthenticated: true
          });
          completeExecution("✅ API key saved successfully!\nYou can now use: ecli [your prompt] (defaults to Codex) or ecli codex [your prompt]");
          resetInput();
        } else {
          completeExecution("❌ Please enter a valid API key");
          resetInput();
        }
      } else if (state.showCommandDropdown) {
        // Handle command dropdown selection
        const filteredCommands = state.input.startsWith("/")
          ? availableCommands.filter(cmd => 
              cmd.name.toLowerCase().startsWith(state.input.toLowerCase())
            )
          : availableCommands;
        const selectedCommand = filteredCommands[state.selectedCommandIndex];
        updateState({ showCommandDropdown: false });
        
        if (selectedCommand.action === 'logout') {
          // Handle logout
          StorageService.logout();
          updateState({
            isClaudeAuthenticated: false,
            isGeminiAuthenticated: false,
            isCodexAuthenticated: false,
            selectedTool: ''
          });
          completeExecution("✅ Successfully logged out from all services");
        } else if (selectedCommand.action === 'setup' || selectedCommand.action === 'mode') {
          updateState({ showModeSelection: true });
        } else if (selectedCommand.action === 'model') {
          // Handle model selection
          handleModelCommand();
        } else if (selectedCommand.action === 'help') {
          completeExecution(`Available Commands:
${availableCommands.map(cmd => `• ${cmd.name} - ${cmd.description}`).join('\n')}

Usage:
• Type "/" to see available commands
• Use ↑↓ arrows to navigate, Enter to select
• Type "/setup" to initialize configuration and switch modes
• After setup: Type your prompt directly or "ecli [prompt]"
• Or specify: "ecli claude [prompt]" or "ecli gemini [prompt]"`);
        } else {
          completeExecution(`Command "${selectedCommand.name}" - ${selectedCommand.description}\n(Implementation coming soon)`);
        }
        resetInput();
      } else {
        // Handle command execution
        const currentInput = state.input.trim();
        
        // Handle direct command input
        if (currentInput.startsWith("/")) {
          const commandName = currentInput;
          const matchedCommand = availableCommands.find(cmd => cmd.name === commandName);
          
          if (matchedCommand) {
            if (matchedCommand.action === 'logout') {
              // Handle logout
              StorageService.logout();
              updateState({
                isClaudeAuthenticated: false,
                isGeminiAuthenticated: false,
                isCodexAuthenticated: false,
                selectedTool: ''
              });
              completeExecution("✅ Successfully logged out from all services");
            } else if (matchedCommand.action === 'setup') {
              updateState({ showModeSelection: true });
            } else if (matchedCommand.action === 'model') {
              // Handle model selection
              handleModelCommand();
            } else if (matchedCommand.action === 'help') {
              completeExecution(`Available Commands:
${availableCommands.map(cmd => `• ${cmd.name} - ${cmd.description}`).join('\n')}

Usage:
• Type "/" to see available commands
• Use ↑↓ arrows to navigate, Enter to select
• Type "/setup" to initialize configuration and switch modes
• After setup: Type your prompt directly or "ecli [prompt]"
• Or specify: "ecli claude [prompt]" or "ecli gemini [prompt]"`);
            } else {
              completeExecution(`Command "${matchedCommand.name}" - ${matchedCommand.description}\n(Implementation coming soon)`);
            }
            resetInput();
            return;
          }
        } else if (currentInput.startsWith("ecli claude")) {
          const claudeCommand = currentInput.replace("ecli claude", "").trim();
          if (claudeCommand) {
            // Check if Claude is authenticated
            if (!state.isClaudeAuthenticated) {
              updateState({ showClaudeSetup: true });
              resetInput();
              return;
            }
            
            updateState({ 
              currentService: 'claude',
              isStreaming: true,
              streamingText: ''
            });
            startExecution();
            
            try {
              const parsedCommand = ClaudeService.parseCommand(claudeCommand);
              const result = await ClaudeService.executeCommandWithStreaming(
                parsedCommand,
                (streamText) => {
                  // Update streaming text in real-time
                  updateState({ streamingText: streamText });
                }
              );
              updateState({ isStreaming: false });
              completeExecution(result.output);
            } catch (error) {
              updateState({ isStreaming: false });
              completeExecution(`❌ Unexpected error: ${error}`);
            }
          } else {
            if (!state.isClaudeAuthenticated) {
              updateState({ showClaudeSetup: true });
            } else {
              completeExecution('Claude Code ready - Usage:\n• ecli "your question here" - for prompts (defaults to Claude)\n• ecli claude "your question here" - explicit Claude usage\n• ecli claude /help - for CLI commands');
            }
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
              completeExecution('Gemini CLI ready - Usage:\n• ecli "your question here" - for prompts (defaults to Gemini)\n• ecli gemini "your question here" - explicit Gemini usage\n• ecli gemini /help - for CLI commands');
              resetInput();
            }
          } else {
            completeExecution("Please select Gemini CLI first using /mode");
            resetInput();
          }
          return;
        } else if (currentInput.startsWith("ecli codex")) {
          const codexCommand = currentInput.replace("ecli codex", "").trim();
          if (codexCommand) {
            // Check if Codex is authenticated
            if (!state.isCodexAuthenticated) {
              updateState({ showCodexSetup: true });
              resetInput();
              return;
            }
            
            updateState({ currentService: 'codex' });
            startExecution();
            
            try {
              const parsedCommand = CodexService.parseCommand(codexCommand);
              const result = await CodexService.executeCommand(parsedCommand);
              completeExecution(result.output);
            } catch (error) {
              completeExecution(`❌ Unexpected error: ${error}`);
            }
          } else {
            if (!state.isCodexAuthenticated) {
              updateState({ showCodexSetup: true });
            } else {
              completeExecution('Codex ready - Usage:\n• ecli "your question here" - for prompts (defaults to Codex)\n• ecli codex "your question here" - explicit Codex usage\n• ecli codex /help - for CLI commands');
            }
            resetInput();
          }
          return;
        } else if (currentInput.startsWith("ecli ")) {
          // Handle generic ecli command - route to default provider
          const prompt = currentInput.replace("ecli ", "").trim();
          if (prompt) {
            // Check which provider to use based on authentication state - prioritize in order
            if (state.isClaudeAuthenticated && !state.isGeminiAuthenticated && !state.isCodexAuthenticated) {
              // Only Claude configured
              updateState({ 
                currentService: 'claude',
                isStreaming: true,
                streamingText: ''
              });
              startExecution();
              
              try {
                const parsedCommand = ClaudeService.parseCommand(prompt);
                const result = await ClaudeService.executeCommandWithStreaming(
                  parsedCommand,
                  (streamText) => {
                    updateState({ streamingText: streamText });
                  }
                );
                updateState({ isStreaming: false });
                completeExecution(result.output);
              } catch (error) {
                updateState({ isStreaming: false });
                completeExecution(`❌ Unexpected error: ${error}`);
              }
            } else if (state.isGeminiAuthenticated && !state.isClaudeAuthenticated && !state.isCodexAuthenticated) {
              // Only Gemini configured
              updateState({ currentService: 'gemini' });
              startExecution();
              
              try {
                const parsedCommand = GeminiService.parseCommand(prompt);
                const result = await GeminiService.executeCommand(parsedCommand);
                completeExecution(result.output);
              } catch (error) {
                completeExecution(`❌ Unexpected error: ${error}`);
              }
            } else if (state.isCodexAuthenticated && !state.isClaudeAuthenticated && !state.isGeminiAuthenticated) {
              // Only Codex configured
              updateState({ currentService: 'codex' });
              startExecution();
              
              try {
                const parsedCommand = CodexService.parseCommand(prompt);
                const result = await CodexService.executeCommand(parsedCommand);
                completeExecution(result.output);
              } catch (error) {
                completeExecution(`❌ Unexpected error: ${error}`);
              }
            } else if (state.isClaudeAuthenticated || state.isGeminiAuthenticated || state.isCodexAuthenticated) {
              // Multiple providers configured - default to first available (Claude > Gemini > Codex)
              if (state.isClaudeAuthenticated) {
                updateState({ 
                  currentService: 'claude',
                  isStreaming: true,
                  streamingText: ''
                });
                startExecution();
                
                try {
                  const parsedCommand = ClaudeService.parseCommand(prompt);
                  const result = await ClaudeService.executeCommandWithStreaming(
                    parsedCommand,
                    (streamText) => {
                      updateState({ streamingText: streamText });
                    }
                  );
                  updateState({ isStreaming: false });
                  completeExecution(result.output);
                } catch (error) {
                  updateState({ isStreaming: false });
                  completeExecution(`❌ Unexpected error: ${error}`);
                }
              } else if (state.isGeminiAuthenticated) {
                updateState({ currentService: 'gemini' });
                startExecution();
                
                try {
                  const parsedCommand = GeminiService.parseCommand(prompt);
                  const result = await GeminiService.executeCommand(parsedCommand);
                  completeExecution(result.output);
                } catch (error) {
                  completeExecution(`❌ Unexpected error: ${error}`);
                }
              } else if (state.isCodexAuthenticated) {
                updateState({ currentService: 'codex' });
                startExecution();
                
                try {
                  const parsedCommand = CodexService.parseCommand(prompt);
                  const result = await CodexService.executeCommand(parsedCommand);
                  completeExecution(result.output);
                } catch (error) {
                  completeExecution(`❌ Unexpected error: ${error}`);
                }
              }
            } else {
              // No provider configured
              completeExecution("❌ No AI provider configured. Please run /setup first.");
            }
          } else {
            completeExecution("Usage: ecli \"your prompt here\"");
          }
          resetInput();
          return;
        } else {
          // Handle direct prompt input - route to default provider if configured
          if (currentInput && !currentInput.startsWith("/")) {
            // Check which provider to use based on authentication state - prioritize in order
            if (state.isClaudeAuthenticated && !state.isGeminiAuthenticated && !state.isCodexAuthenticated) {
              // Only Claude configured
              updateState({ 
                currentService: 'claude',
                isStreaming: true,
                streamingText: ''
              });
              startExecution();
              
              try {
                const parsedCommand = ClaudeService.parseCommand(currentInput);
                const result = await ClaudeService.executeCommandWithStreaming(
                  parsedCommand,
                  (streamText) => {
                    updateState({ streamingText: streamText });
                  }
                );
                updateState({ isStreaming: false });
                completeExecution(result.output);
              } catch (error) {
                updateState({ isStreaming: false });
                completeExecution(`❌ Unexpected error: ${error}`);
              }
            } else if (state.isGeminiAuthenticated && !state.isClaudeAuthenticated && !state.isCodexAuthenticated) {
              // Only Gemini configured
              updateState({ currentService: 'gemini' });
              startExecution();
              
              try {
                const parsedCommand = GeminiService.parseCommand(currentInput);
                const result = await GeminiService.executeCommand(parsedCommand);
                completeExecution(result.output);
              } catch (error) {
                completeExecution(`❌ Unexpected error: ${error}`);
              }
            } else if (state.isCodexAuthenticated && !state.isClaudeAuthenticated && !state.isGeminiAuthenticated) {
              // Only Codex configured
              updateState({ currentService: 'codex' });
              startExecution();
              
              try {
                const parsedCommand = CodexService.parseCommand(currentInput);
                const result = await CodexService.executeCommand(parsedCommand);
                completeExecution(result.output);
              } catch (error) {
                completeExecution(`❌ Unexpected error: ${error}`);
              }
            } else if (state.isClaudeAuthenticated || state.isGeminiAuthenticated || state.isCodexAuthenticated) {
              // Multiple providers configured - default to first available (Claude > Gemini > Codex)
              if (state.isClaudeAuthenticated) {
                updateState({ 
                  currentService: 'claude',
                  isStreaming: true,
                  streamingText: ''
                });
                startExecution();
                
                try {
                  const parsedCommand = ClaudeService.parseCommand(currentInput);
                  const result = await ClaudeService.executeCommandWithStreaming(
                    parsedCommand,
                    (streamText) => {
                      updateState({ streamingText: streamText });
                    }
                  );
                  updateState({ isStreaming: false });
                  completeExecution(result.output);
                } catch (error) {
                  updateState({ isStreaming: false });
                  completeExecution(`❌ Unexpected error: ${error}`);
                }
              } else if (state.isGeminiAuthenticated) {
                updateState({ currentService: 'gemini' });
                startExecution();
                
                try {
                  const parsedCommand = GeminiService.parseCommand(currentInput);
                  const result = await GeminiService.executeCommand(parsedCommand);
                  completeExecution(result.output);
                } catch (error) {
                  completeExecution(`❌ Unexpected error: ${error}`);
                }
              } else if (state.isCodexAuthenticated) {
                updateState({ currentService: 'codex' });
                startExecution();
                
                try {
                  const parsedCommand = CodexService.parseCommand(currentInput);
                  const result = await CodexService.executeCommand(parsedCommand);
                  completeExecution(result.output);
                } catch (error) {
                  completeExecution(`❌ Unexpected error: ${error}`);
                }
              }
            } else {
              // No provider configured
              completeExecution("❌ No AI provider configured. Please run /setup first.");
            }
            resetInput();
            return;
          }
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
    } else if (state.showModelSelection && (key.upArrow || key.downArrow)) {
      // Handle arrow key navigation in model selection
      const maxIndex = state.availableModels.length - 1;
      if (key.upArrow) {
        updateState({ selectedModelIndex: state.selectedModelIndex === 0 ? maxIndex : state.selectedModelIndex - 1 });
      } else if (key.downArrow) {
        updateState({ selectedModelIndex: state.selectedModelIndex === maxIndex ? 0 : state.selectedModelIndex + 1 });
      }
    } else if (state.showCommandDropdown && (key.upArrow || key.downArrow)) {
      // Handle arrow key navigation in command dropdown
      const filteredCommands = state.input.startsWith("/")
        ? availableCommands.filter(cmd => 
            cmd.name.toLowerCase().startsWith(state.input.toLowerCase())
          )
        : availableCommands;
      const maxIndex = filteredCommands.length - 1;
      if (key.upArrow) {
        updateState({ selectedCommandIndex: state.selectedCommandIndex === 0 ? maxIndex : state.selectedCommandIndex - 1 });
      } else if (key.downArrow) {
        updateState({ selectedCommandIndex: state.selectedCommandIndex === maxIndex ? 0 : state.selectedCommandIndex + 1 });
      }
    } else if (state.showCommandDropdown && key.escape) {
      // Close command dropdown on Escape
      updateState({ showCommandDropdown: false });
      resetInput();
    } else if (state.showCommandDropdown && (key.backspace || key.delete)) {
      // Handle backspace in command dropdown
      if (state.cursorPosition > 0) {
        const newInput = state.input.slice(0, state.cursorPosition - 1) + state.input.slice(state.cursorPosition);
        if (newInput === "") {
          // If input becomes empty, close dropdown
          updateState({
            input: newInput,
            cursorPosition: state.cursorPosition - 1,
            showCommandDropdown: false
          });
        } else if (newInput.startsWith("/")) {
          // Keep dropdown open and reset selection if needed
          const filteredCommands = availableCommands.filter(cmd => 
            cmd.name.toLowerCase().startsWith(newInput.toLowerCase())
          );
          const newSelectedIndex = state.selectedCommandIndex >= filteredCommands.length 
            ? 0 
            : state.selectedCommandIndex;
          
          updateState({
            input: newInput,
            cursorPosition: state.cursorPosition - 1,
            showCommandDropdown: true,
            selectedCommandIndex: newSelectedIndex
          });
        } else {
          // Close dropdown if no longer starts with "/"
          updateState({
            input: newInput,
            cursorPosition: state.cursorPosition - 1,
            showCommandDropdown: false
          });
        }
      }
    } else if (state.showCommandDropdown && inputChar && !key.ctrl && !key.meta) {
      // Handle typing while command dropdown is open
      const newInput = state.input.slice(0, state.cursorPosition) + inputChar + state.input.slice(state.cursorPosition);
      if (newInput.startsWith("/")) {
        // Filter commands based on new input and reset selection if needed
        const filteredCommands = availableCommands.filter(cmd => 
          cmd.name.toLowerCase().startsWith(newInput.toLowerCase())
        );
        const newSelectedIndex = state.selectedCommandIndex >= filteredCommands.length 
          ? 0 
          : state.selectedCommandIndex;
        
        updateState({
          input: newInput,
          cursorPosition: state.cursorPosition + 1,
          showCommandDropdown: true,
          selectedCommandIndex: newSelectedIndex
        });
      } else {
        updateState({
          input: newInput,
          cursorPosition: state.cursorPosition + 1,
          showCommandDropdown: false
        });
      }
    } else if (state.showGeminiSetup && (key.backspace || key.delete)) {
      updateState({ apiKeyInput: state.apiKeyInput.slice(0, -1) });
    } else if (state.showGeminiSetup && inputChar && !key.ctrl && !key.meta) {
      updateState({ apiKeyInput: state.apiKeyInput + inputChar });
    } else if (state.showClaudeSetup && (key.backspace || key.delete)) {
      updateState({ claudeApiKeyInput: state.claudeApiKeyInput.slice(0, -1) });
    } else if (state.showClaudeSetup && inputChar && !key.ctrl && !key.meta) {
      updateState({ claudeApiKeyInput: state.claudeApiKeyInput + inputChar });
    } else if (state.showCodexSetup && (key.backspace || key.delete)) {
      updateState({ codexApiKeyInput: state.codexApiKeyInput.slice(0, -1) });
    } else if (state.showCodexSetup && inputChar && !key.ctrl && !key.meta) {
      updateState({ codexApiKeyInput: state.codexApiKeyInput + inputChar });
    } else if (!state.showModeSelection && !state.showToolSelection && !state.showGeminiSetup && !state.showClaudeSetup && !state.showCodexSetup && !state.showCommandDropdown && !state.isExecuting && key.leftArrow) {
      updateState({ cursorPosition: Math.max(0, state.cursorPosition - 1) });
    } else if (!state.showModeSelection && !state.showToolSelection && !state.showGeminiSetup && !state.showClaudeSetup && !state.showCodexSetup && !state.showCommandDropdown && !state.isExecuting && key.rightArrow) {
      updateState({ cursorPosition: Math.min(state.input.length, state.cursorPosition + 1) });
    } else if (!state.showModeSelection && !state.showToolSelection && !state.showGeminiSetup && !state.showClaudeSetup && !state.showCodexSetup && !state.showCommandDropdown && !state.isExecuting && (key.backspace || key.delete)) {
      if (state.cursorPosition > 0) {
        const newInput = state.input.slice(0, state.cursorPosition - 1) + state.input.slice(state.cursorPosition);
        updateState({
          input: newInput,
          cursorPosition: state.cursorPosition - 1
        });
      }
    } else if (!state.showModeSelection && !state.showToolSelection && !state.showGeminiSetup && !state.showClaudeSetup && !state.showCodexSetup && !state.showCommandDropdown && !state.isExecuting && inputChar && !key.ctrl && !key.meta) {
      const newInput = state.input.slice(0, state.cursorPosition) + inputChar + state.input.slice(state.cursorPosition);
      
      // Check if the new input starts with "/" to show command dropdown
      if (newInput === "/") {
        updateState({
          input: newInput,
          cursorPosition: state.cursorPosition + 1,
          showCommandDropdown: true,
          selectedCommandIndex: 0
        });
      } else if (newInput.startsWith("/") && newInput.length > 1) {
        // User is typing a command, keep dropdown open but don't change selection
        updateState({
          input: newInput,
          cursorPosition: state.cursorPosition + 1,
          showCommandDropdown: true
        });
      } else {
        updateState({
          input: newInput,
          cursorPosition: state.cursorPosition + 1
        });
      }
    }
  });
};