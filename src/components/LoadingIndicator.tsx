import React from 'react';
import { Box, Text } from 'ink';

interface LoadingIndicatorProps {
  loadingDots: number;
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ loadingDots }) => {
  return (
    <Box marginTop={2} marginBottom={1}>
      <Text color="blue">🤖 Gemini is thinking{".".repeat(loadingDots)}</Text>
    </Box>
  );
};