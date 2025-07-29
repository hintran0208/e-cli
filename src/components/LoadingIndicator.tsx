import React from 'react';
import { Box, Text } from 'ink';

interface LoadingIndicatorProps {
  loadingDots: number;
  currentService: 'claude' | 'gemini' | 'codex' | '';
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ loadingDots, currentService }) => {
  const getServiceName = () => {
    switch (currentService) {
      case 'claude':
        return '🧠 Claude is thinking';
      case 'gemini':
        return '🤖 Gemini is thinking';
      case 'codex':
        return '⚡ Codex is thinking';
      default:
        return '🤖 Processing';
    }
  };

  return (
    <Box marginTop={2} marginBottom={1}>
      <Text color="blue">{getServiceName()}{".".repeat(loadingDots)}</Text>
    </Box>
  );
};