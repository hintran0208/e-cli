import React from 'react';
import { Box, Text } from 'ink';
import { Header } from './Header.js';

interface ModeSelectionProps {
  title: string;
  selectedModeIndex: number;
}

export const ModeSelection: React.FC<ModeSelectionProps> = ({ title, selectedModeIndex }) => {
  const modes = ['Default', 'Scenario'];

  return (
    <Box flexDirection="column" padding={1}>
      <Header title={title} />

      <Box marginBottom={1}>
        <Text color="whiteBright">Which mode do you want to use?</Text>
      </Box>
      
      {modes.map((mode, index) => (
        <Box key={mode}>
          <Text color={selectedModeIndex === index ? "blue" : "whiteBright"}>
            {selectedModeIndex === index ? "▶ " : "  "}{mode}
          </Text>
        </Box>
      ))}

      <Box marginTop={2}>
        <Text color="gray">Use ↑↓ arrows to navigate, Enter to select</Text>
      </Box>
    </Box>
  );
};