import React from "react";
import { ModeSelection, ToolSelection, GeminiSetup, ClaudeSetup, MainInterface } from "./components/index.js";
import { useAppState } from "./hooks/useAppState.js";
import { useInputHandler } from "./hooks/useInputHandler.js";
import { availableCommands } from "./config/commands.js";

const App: React.FC = () => {
  const { state, updateState, resetInput, startExecution, completeExecution } = useAppState();

  // Handle all input interactions
  useInputHandler({
    state,
    updateState,
    resetInput,
    startExecution,
    completeExecution
  });

  const title = `

 ███████╗            ██████╗  ██╗      ██╗ 
 ██╔════╝           ██╔════╝  ██║      ██║ 
 █████╗   █████╗    ██║       ██║      ██║ 
 ██╔══╝   ╚════╝    ██║       ██║      ██║ 
 ███████╗           ╚██████╗  ███████╗ ██║ 
 ╚══════╝            ╚═════╝  ╚══════╝ ╚═╝ 
`;

  if (state.showGeminiSetup) {
    return <GeminiSetup title={title} apiKeyInput={state.apiKeyInput} />;
  }

  if (state.showClaudeSetup) {
    return <ClaudeSetup title={title} claudeApiKeyInput={state.claudeApiKeyInput} />;
  }

  if (state.showToolSelection) {
    return <ToolSelection title={title} selectedToolIndex={state.selectedToolIndex} />;
  }

  if (state.showModeSelection) {
    return <ModeSelection title={title} selectedModeIndex={state.selectedModeIndex} />;
  }

  // Filter commands based on user input when showing dropdown
  const filteredCommands = state.showCommandDropdown && state.input.startsWith("/")
    ? availableCommands.filter(cmd => 
        cmd.name.toLowerCase().startsWith(state.input.toLowerCase())
      )
    : availableCommands;

  return (
    <MainInterface
      title={title}
      input={state.input}
      cursorPosition={state.cursorPosition}
      isExecuting={state.isExecuting}
      loadingDots={state.loadingDots}
      currentService={state.currentService}
      showResponse={state.showResponse}
      responseText={state.responseText}
      isStreaming={state.isStreaming}
      streamingText={state.streamingText}
      showCommandDropdown={state.showCommandDropdown}
      selectedCommandIndex={state.selectedCommandIndex}
      availableCommands={filteredCommands}
    />
  );
};

export default App;