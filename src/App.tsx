import React from "react";
import { ModeSelection, ToolSelection, GeminiSetup, MainInterface } from "./components/index.js";
import { useAppState } from "./hooks/useAppState.js";
import { useInputHandler } from "./hooks/useInputHandler.js";

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

  if (state.showToolSelection) {
    return <ToolSelection title={title} selectedToolIndex={state.selectedToolIndex} />;
  }

  if (state.showModeSelection) {
    return <ModeSelection title={title} selectedModeIndex={state.selectedModeIndex} />;
  }

  return (
    <MainInterface
      title={title}
      input={state.input}
      cursorPosition={state.cursorPosition}
      isExecuting={state.isExecuting}
      loadingDots={state.loadingDots}
      showResponse={state.showResponse}
      responseText={state.responseText}
    />
  );
};

export default App;