import React from 'react';
import { Box, Text } from 'ink';
import gradient from 'gradient-string';

interface HeaderProps {
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <Box marginBottom={1}>
      <Text>{gradient(["#0066ff", "#00ff66"])(title)}</Text>
    </Box>
  );
};