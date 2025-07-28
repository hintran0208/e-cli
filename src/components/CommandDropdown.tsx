import React from 'react';
import { Box, Text } from 'ink';
import { Command } from '../types/index.js';

interface CommandDropdownProps {
  commands: Command[];
  selectedCommandIndex: number;
}

export const CommandDropdown: React.FC<CommandDropdownProps> = ({
  commands,
  selectedCommandIndex
}) => {
  return (
    <Box flexDirection="column" marginTop={1}>
      {commands.map((command, index) => (
        <Box key={command.name}>
          <Text 
            color={index === selectedCommandIndex ? "black" : "white"}
            backgroundColor={index === selectedCommandIndex ? "cyan" : undefined}
          >
            {command.name.padEnd(20)} {command.description}
          </Text>
        </Box>
      ))}
      <Box marginTop={1}>
        <Text color="gray" dimColor>Use ↑↓ arrows to navigate, Enter to select, Esc to close</Text>
      </Box>
    </Box>
  );
};