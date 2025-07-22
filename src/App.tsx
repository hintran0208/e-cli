import React, { useState } from "react";
import { Box, Text, useInput } from "ink";
import gradient from "gradient-string";

const App: React.FC = () => {
  const [input, setInput] = useState("");
  const [showModeSelection, setShowModeSelection] = useState(false);
  const [selectedModeIndex, setSelectedModeIndex] = useState(0);

  useInput((inputChar: string, key: any) => {
    if (key.return) {
      if (showModeSelection) {
        // Handle mode selection
        if (selectedModeIndex === 0) {
          console.log("Default mode selected");
        } else if (selectedModeIndex === 1) {
          console.log("Scenario mode selected");
        }
        setShowModeSelection(false);
        setSelectedModeIndex(0);
        setInput("");
      } else {
        // Handle command execution
        const currentInput = input.trim();
        console.log(`Debug - Input received: "${currentInput}"`);
        if (currentInput === "/mode") {
          console.log("Mode command detected!");
          setShowModeSelection(true);
          setInput("");
          return;
        }
        console.log(`Executing: ${currentInput}`);
        process.exit(0);
      }
    } else if (showModeSelection && (key.upArrow || key.downArrow)) {
      // Handle arrow key navigation in mode selection
      if (key.upArrow) {
        setSelectedModeIndex((prev) => prev === 0 ? 1 : 0);
      } else if (key.downArrow) {
        setSelectedModeIndex((prev) => prev === 1 ? 0 : 1);
      }
    } else if (!showModeSelection && (key.backspace || key.delete)) {
      setInput((prev) => prev.slice(0, -1));
    } else if (!showModeSelection && inputChar && !key.ctrl && !key.meta) {
      setInput((prev) => prev + inputChar);
    }
  });

  const title = `

 ███████╗            ██████╗  ██╗      ██╗ 
 ██╔════╝           ██╔════╝  ██║      ██║ 
 █████╗   █████╗    ██║       ██║      ██║ 
 ██╔══╝   ╚════╝    ██║       ██║      ██║ 
 ███████╗           ╚██████╗  ███████╗ ██║ 
 ╚══════╝            ╚═════╝  ╚══════╝ ╚═╝ 
`;

  if (showModeSelection) {
    return (
      <Box flexDirection="column" padding={1}>
        <Box marginBottom={1}>
          <Text>{gradient(["#0066ff", "#00ff66"])(title)}</Text>
        </Box>

        <Box marginBottom={1}>
          <Text color="whiteBright">Which mode do you want to use?</Text>
        </Box>
        
        <Box>
          <Text color={selectedModeIndex === 0 ? "blue" : "whiteBright"}>
            {selectedModeIndex === 0 ? "▶ " : "  "}Default
          </Text>
        </Box>
        <Box>
          <Text color={selectedModeIndex === 1 ? "blue" : "whiteBright"}>
            {selectedModeIndex === 1 ? "▶ " : "  "}Scenario
          </Text>
        </Box>

        <Box marginTop={2}>
          <Text color="gray">Use ↑↓ arrows to navigate, Enter to select</Text>
        </Box>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" padding={1}>
      <Box marginBottom={1}>
        <Text>{gradient(["#0066ff", "#00ff66"])(title)}</Text>
      </Box>

      <Box marginBottom={1}>
        <Text color="whiteBright">Tips for getting started:</Text>
      </Box>
      <Text color="whiteBright">• Be specific for the best results</Text>
      <Box>
        <Text color="whiteBright">• </Text>
        <Text color="blue">/setup</Text>
        <Text color="whiteBright"> to initialize your configuration</Text>
      </Box>
      <Box>
        <Text color="whiteBright">• </Text>
        <Text color="blue">/mode</Text>
        <Text color="whiteBright"> to switch between different modes</Text>
      </Box>
      <Box>
        <Text color="whiteBright">• </Text>
        <Text color="blue">/help</Text>
        <Text color="whiteBright"> for more information</Text>
      </Box>

      <Box
        marginTop={2}
        marginBottom={1}
        borderStyle="round"
        borderColor="blue"
        paddingLeft={1}
        paddingRight={1}
      >
        <Text color="blue">{"> "}</Text>
        {input ? (
          <Text color="whiteBright">{input}</Text>
        ) : (
          <Text color="whiteBright">Type your message or @path/to/file</Text>
        )}
        {input && <Text color="gray">█</Text>}
      </Box>
    </Box>
  );
};

export default App;
