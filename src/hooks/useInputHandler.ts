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
  completeExecutionWithHistory: (responseText: string, service?: 'claude' | 'gemini' | 'codex') => void;
  addUserMessage: (content: string) => void;
  addAssistantMessage: (content: string, service?: 'claude' | 'gemini' | 'codex') => void;
}

export const useInputHandler = ({
  state,
  updateState,
  resetInput,
  startExecution,
  completeExecution,
  completeExecutionWithHistory,
  addUserMessage,
  addAssistantMessage
}: UseInputHandlerProps) => {
  
  const extractUserMessage = (fullPrompt: string): string => {
    // Extract the actual user message from various command formats
    if (fullPrompt.startsWith("ecli claude ")) {
      return fullPrompt.replace("ecli claude ", "").trim();
    } else if (fullPrompt.startsWith("ecli gemini ")) {
      return fullPrompt.replace("ecli gemini ", "").trim();
    } else if (fullPrompt.startsWith("ecli codex ")) {
      return fullPrompt.replace("ecli codex ", "").trim();
    } else if (fullPrompt.startsWith("ecli ")) {
      return fullPrompt.replace("ecli ", "").trim();
    }
    return fullPrompt;
  };
  
  const executePromptWithHistory = async (
    prompt: string, 
    service: 'claude' | 'gemini' | 'codex',
    serviceCall: () => Promise<any>,
    isStreaming = false,
    userMessage?: string
  ) => {
    // Extract user message from prompt
    const messageToAdd = userMessage || extractUserMessage(prompt);
    
    // Add user message to conversation history and start execution
    addUserMessage(messageToAdd);
    
    // Start execution with service info
    updateState({ 
      currentService: service,
      isStreaming: isStreaming,
      streamingText: '',
      input: '',
      cursorPosition: 0,
      isExecuting: true
    });
    
    try {
      const result = await serviceCall();
      // Use completeExecutionWithHistory to add assistant message and complete
      if (isStreaming) {
        updateState({ isStreaming: false });
      }
      completeExecutionWithHistory(result.output, service);
    } catch (error) {
      const errorMsg = `❌ Unexpected error: ${error}`;
      if (isStreaming) {
        updateState({ isStreaming: false });
      }
      completeExecutionWithHistory(errorMsg, service);
    }
  };
  
  const handleModelCommand = () => {
    // Determine which providers are available and prioritize
    const authenticatedProviders = [];
    if (state.isClaudeAuthenticated) authenticatedProviders.push('claude');
    if (state.isGeminiAuthenticated) authenticatedProviders.push('gemini');
    if (state.isCodexAuthenticated) authenticatedProviders.push('codex');

    if (authenticatedProviders.length === 0) {
      completeExecutionWithHistory("Welcome to E-CLI!\n\nNo AI provider configured yet.\n\nQuick Setup:\n• Type /setup to choose and configure an AI provider\n• Available options: Claude Code, Gemini CLI, or OpenAI Codex\n• After setup, you can use: \"your question here\"\n\nNeed help? Type /help for more information");
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
          completeExecutionWithHistory(`Claude model set to: ${selectedModel}`);
        } else if (state.modelProvider === 'gemini') {
          StorageService.saveGeminiModel(selectedModel);
          completeExecutionWithHistory(`Gemini model set to: ${selectedModel}`);
        } else if (state.modelProvider === 'codex') {
          StorageService.saveCodexModel(selectedModel);
          completeExecutionWithHistory(`Codex model set to: ${selectedModel}`);
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
          completeExecutionWithHistory("Gemini CLI configured successfully!\n\nYou're all set! Try these:\n• \"Write a hello world program\"\n• ecli gemini \"Explain machine learning\"\n• /help for more options");
          resetInput();
        } else {
          completeExecutionWithHistory("Please enter a valid API key");
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
          completeExecutionWithHistory("Claude Code configured successfully!\n\nYou're all set! Try these:\n• \"Write a hello world program\"\n• ecli claude \"Explain this code\"\n• /help for more options");
          resetInput();
        } else {
          completeExecutionWithHistory("Please enter a valid API key");
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
          completeExecutionWithHistory("OpenAI Codex configured successfully!\n\nYou're all set! Try these:\n• \"Write a hello world program\"\n• ecli codex \"Debug this JavaScript error\"\n• /help for more options");
          resetInput();
        } else {
          completeExecutionWithHistory("Please enter a valid API key");
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
          completeExecutionWithHistory("Successfully logged out from all services");
        } else if (selectedCommand.action === 'setup' || selectedCommand.action === 'mode') {
          updateState({ showModeSelection: true });
        } else if (selectedCommand.action === 'model') {
          // Handle model selection
          handleModelCommand();
        } else if (selectedCommand.action === 'help') {
          completeExecution(`🚀 E-CLI Help - Unified AI Assistant

📋 Available Commands:
${availableCommands.map(cmd => `• ${cmd.name} - ${cmd.description}`).join('\n')}

🎯 Quick Start:
• Type /setup to configure AI providers (Claude, Gemini, or Codex)
• Use quotes for AI prompts: "your question here"
• Use /model to switch between different AI models

⌨️  Navigation:
• Type "/" to see available commands
• Use ↑↓ arrows to navigate, Enter to select
• Commands stay in the CLI - no more exits!

🤖 Usage Examples:
• "Write a Python function to sort a list"
• ecli claude "Explain this code"
• ecli gemini "What is machine learning?"
• ecli codex "Debug this JavaScript error"`);
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
              completeExecutionWithHistory("Successfully logged out from all services");
            } else if (matchedCommand.action === 'setup') {
              updateState({ showModeSelection: true });
            } else if (matchedCommand.action === 'model') {
              // Handle model selection
              handleModelCommand();
            } else if (matchedCommand.action === 'help') {
              completeExecution(`🚀 E-CLI Help - Unified AI Assistant

📋 Available Commands:
${availableCommands.map(cmd => `• ${cmd.name} - ${cmd.description}`).join('\n')}

🎯 Quick Start:
• Type /setup to configure AI providers (Claude, Gemini, or Codex)
• Use quotes for AI prompts: "your question here"
• Use /model to switch between different AI models

⌨️  Navigation:
• Type "/" to see available commands
• Use ↑↓ arrows to navigate, Enter to select
• Commands stay in the CLI - no more exits!

🤖 Usage Examples:
• "Write a Python function to sort a list"
• ecli claude "Explain this code"
• ecli gemini "What is machine learning?"
• ecli codex "Debug this JavaScript error"`);
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
            
            await executePromptWithHistory(currentInput, 'claude', async () => {
              const parsedCommand = ClaudeService.parseCommand(claudeCommand);
              return await ClaudeService.executeCommandWithStreaming(
                parsedCommand,
                (streamText) => {
                  updateState({ streamingText: streamText });
                }
              );
            }, true); // isStreaming = true
          } else {
            if (!state.isClaudeAuthenticated) {
              updateState({ showClaudeSetup: true });
            } else {
              completeExecution('🧠 Claude Code is ready!\n\n✨ Try these commands:\n• "your question here" - Ask Claude anything\n• ecli claude "your question here" - Explicit Claude usage\n• /help - See all available options');
            }
            resetInput();
          }
          return;
        } else if (currentInput.startsWith("ecli gemini")) {
          if (state.selectedTool === "Gemini CLI") {
            const geminiCommand = currentInput.replace("ecli gemini", "").trim();
            if (geminiCommand) {
              await executePromptWithHistory(currentInput, 'gemini', async () => {
                const parsedCommand = GeminiService.parseCommand(geminiCommand);
                return await GeminiService.executeCommand(parsedCommand);
              });
            } else {
              completeExecution('🤖 Gemini CLI is ready!\n\n✨ Try these commands:\n• "your question here" - Ask Gemini anything\n• ecli gemini "your question here" - Explicit Gemini usage\n• /help - See all available options');
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
            
            await executePromptWithHistory(currentInput, 'codex', async () => {
              const parsedCommand = CodexService.parseCommand(codexCommand);
              return await CodexService.executeCommand(parsedCommand);
            });
          } else {
            if (!state.isCodexAuthenticated) {
              updateState({ showCodexSetup: true });
            } else {
              completeExecution('⚡ OpenAI Codex is ready!\n\n✨ Try these commands:\n• "your question here" - Ask Codex anything\n• ecli codex "your question here" - Explicit Codex usage\n• /help - See all available options');
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
              await executePromptWithHistory(currentInput, 'claude', async () => {
                const parsedCommand = ClaudeService.parseCommand(prompt);
                return await ClaudeService.executeCommandWithStreaming(
                  parsedCommand,
                  (streamText) => {
                    updateState({ streamingText: streamText });
                  }
                );
              }, true); // isStreaming = true
            } else if (state.isGeminiAuthenticated && !state.isClaudeAuthenticated && !state.isCodexAuthenticated) {
              // Only Gemini configured
              await executePromptWithHistory(currentInput, 'gemini', async () => {
                const parsedCommand = GeminiService.parseCommand(prompt);
                return await GeminiService.executeCommand(parsedCommand);
              });
            } else if (state.isCodexAuthenticated && !state.isClaudeAuthenticated && !state.isGeminiAuthenticated) {
              // Only Codex configured
              await executePromptWithHistory(currentInput, 'codex', async () => {
                const parsedCommand = CodexService.parseCommand(prompt);
                return await CodexService.executeCommand(parsedCommand);
              });
            } else if (state.isClaudeAuthenticated || state.isGeminiAuthenticated || state.isCodexAuthenticated) {
              // Multiple providers configured - default to first available (Claude > Gemini > Codex)
              if (state.isClaudeAuthenticated) {
                await executePromptWithHistory(currentInput, 'claude', async () => {
                  const parsedCommand = ClaudeService.parseCommand(prompt);
                  return await ClaudeService.executeCommandWithStreaming(
                    parsedCommand,
                    (streamText) => {
                      updateState({ streamingText: streamText });
                    }
                  );
                }, true); // isStreaming = true
              } else if (state.isGeminiAuthenticated) {
                await executePromptWithHistory(currentInput, 'gemini', async () => {
                  const parsedCommand = GeminiService.parseCommand(prompt);
                  return await GeminiService.executeCommand(parsedCommand);
                });
              } else if (state.isCodexAuthenticated) {
                await executePromptWithHistory(currentInput, 'codex', async () => {
                  const parsedCommand = CodexService.parseCommand(prompt);
                  return await CodexService.executeCommand(parsedCommand);
                });
              }
            } else {
              // No provider configured  
              completeExecutionWithHistory("Welcome to E-CLI!\n\nNo AI provider configured yet.\n\nQuick Setup:\n• Type /setup to choose and configure an AI provider\n• Available options: Claude Code, Gemini CLI, or OpenAI Codex\n• After setup, you can use: ecli \"your question here\"\n\nNeed help? Type /help for more information");
            }
          } else {
            completeExecutionWithHistory("Usage: ecli \"your prompt here\"");
          }
          resetInput();
          return;
        } else {
          // Handle direct prompt input - route to default provider if configured
          if (currentInput && !currentInput.startsWith("/")) {
            // Check which provider to use based on authentication state - prioritize in order
            if (state.isClaudeAuthenticated && !state.isGeminiAuthenticated && !state.isCodexAuthenticated) {
              // Only Claude configured
              await executePromptWithHistory(currentInput, 'claude', async () => {
                const parsedCommand = ClaudeService.parseCommand(currentInput);
                return await ClaudeService.executeCommandWithStreaming(
                  parsedCommand,
                  (streamText) => {
                    updateState({ streamingText: streamText });
                  }
                );
              }, true); // isStreaming = true
            } else if (state.isGeminiAuthenticated && !state.isClaudeAuthenticated && !state.isCodexAuthenticated) {
              // Only Gemini configured
              await executePromptWithHistory(currentInput, 'gemini', async () => {
                const parsedCommand = GeminiService.parseCommand(currentInput);
                return await GeminiService.executeCommand(parsedCommand);
              });
            } else if (state.isCodexAuthenticated && !state.isClaudeAuthenticated && !state.isGeminiAuthenticated) {
              // Only Codex configured
              await executePromptWithHistory(currentInput, 'codex', async () => {
                const parsedCommand = CodexService.parseCommand(currentInput);
                return await CodexService.executeCommand(parsedCommand);
              });
            } else if (state.isClaudeAuthenticated || state.isGeminiAuthenticated || state.isCodexAuthenticated) {
              // Multiple providers configured - default to first available (Claude > Gemini > Codex)
              if (state.isClaudeAuthenticated) {
                await executePromptWithHistory(currentInput, 'claude', async () => {
                  const parsedCommand = ClaudeService.parseCommand(currentInput);
                  return await ClaudeService.executeCommandWithStreaming(
                    parsedCommand,
                    (streamText) => {
                      updateState({ streamingText: streamText });
                    }
                  );
                }, true); // isStreaming = true
              } else if (state.isGeminiAuthenticated) {
                await executePromptWithHistory(currentInput, 'gemini', async () => {
                  const parsedCommand = GeminiService.parseCommand(currentInput);
                  return await GeminiService.executeCommand(parsedCommand);
                });
              } else if (state.isCodexAuthenticated) {
                await executePromptWithHistory(currentInput, 'codex', async () => {
                  const parsedCommand = CodexService.parseCommand(currentInput);
                  return await CodexService.executeCommand(parsedCommand);
                });
              }
            } else {
              // No provider configured
              completeExecutionWithHistory("Welcome to E-CLI!\n\nNo AI provider configured yet.\n\nQuick Setup:\n• Type /setup to choose and configure an AI provider\n• Available options: Claude Code, Gemini CLI, or OpenAI Codex\n• After setup, you can use: \"your question here\"\n\nNeed help? Type /help for more information");
            }
            resetInput();
            return;
          }
        }
        // Unknown command - show help instead of exiting
        completeExecution(`❓ Unknown command: "${currentInput}"\n\nAvailable options:\n• Type /setup to configure AI providers\n• Type /help for more information\n• Use quotes for prompts: "your question here"`);
        resetInput();
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