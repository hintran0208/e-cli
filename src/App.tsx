import React, { useState } from "react";
import { Box, Text, useInput } from "ink";
import gradient from "gradient-string";

const App: React.FC = () => {
  const [input, setInput] = useState("");

  useInput((input: string, key: any) => {
    if (key.return) {
      // Handle command execution here
      console.log(`Executing: ${input}`);
      process.exit(0);
    } else if (key.backspace || key.delete) {
      setInput((prev) => prev.slice(0, -1));
    } else if (input && !key.ctrl && !key.meta) {
      setInput((prev) => prev + input);
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
          <Text color="white">{input}</Text>
        ) : (
          <Text color="white">Type your message or @path/to/file</Text>
        )}
        {input && <Text color="gray">█</Text>}
      </Box>
    </Box>
  );
};

export default App;
