import React from 'react';
import { Box, Text } from 'ink';

interface ResponseDisplayProps {
  responseText: string;
}

export const ResponseDisplay: React.FC<ResponseDisplayProps> = ({ responseText }) => {
  return (
    <Box marginTop={2} paddingLeft={1}>
      <Text color="green">{responseText}</Text>
    </Box>
  );
};