import React from 'react';
import { Box, Text } from 'ink';
import { Header } from './Header.js';

interface ToolSelectionProps {
  title: string;
  selectedToolIndex: number;
}

export const ToolSelection: React.FC<ToolSelectionProps> = ({ title, selectedToolIndex }) => {
  const tools = ["Claude Code", "Gemini CLI", "CodeX OpenAI"];

  return (
    <Box flexDirection="column" padding={1}>
      <Header title={title} />

      <Box marginBottom={1}>
        <Text color="whiteBright">Hey Boss! Please choose the best coding tool</Text>
      </Box>
      
      {tools.map((tool, index) => (
        <Box key={tool}>
          <Text color={selectedToolIndex === index ? "blue" : "whiteBright"}>
            {selectedToolIndex === index ? "▶ " : "  "}{tool}
          </Text>
        </Box>
      ))}

      <Box marginTop={2}>
        <Text color="gray">Use ↑↓ arrows to navigate, Enter to select</Text>
      </Box>
    </Box>
  );
};