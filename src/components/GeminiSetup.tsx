import React from 'react';
import { Box, Text } from 'ink';
import { Header } from './Header.js';

interface GeminiSetupProps {
  title: string;
  apiKeyInput: string;
}

export const GeminiSetup: React.FC<GeminiSetupProps> = ({ title, apiKeyInput }) => {
  return (
    <Box flexDirection="column" padding={1}>
      <Header title={title} />

      <Box marginBottom={1}>
        <Text color="blue">🚀 Gemini CLI Setup</Text>
      </Box>
      
      <Box marginBottom={1}>
        <Text color="whiteBright">Welcome to Gemini CLI! Please enter your API key:</Text>
      </Box>

      <Box marginBottom={1}>
        <Text color="whiteBright">Get your API key from:</Text>
        <Text color="blue">https://aistudio.google.com/app/apikey</Text>
      </Box>

      <Box
        marginTop={2}
        marginBottom={1}
        borderStyle="round"
        borderColor="blue"
        paddingLeft={1}
        paddingRight={1}
      >
        <Text color="blue">API Key: </Text>
        {apiKeyInput ? (
          <Text color="whiteBright">{"*".repeat(apiKeyInput.length)}</Text>
        ) : (
          <Text color="gray">Enter your Gemini API key</Text>
        )}
        <Text color="gray">█</Text>
      </Box>

      <Box marginTop={1}>
        <Text color="gray">Enter your API key and press Enter to save</Text>
      </Box>
    </Box>
  );
};