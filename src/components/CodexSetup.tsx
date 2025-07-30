import React from 'react';
import { Box, Text } from 'ink';
import { Header } from './Header.js';

interface CodexSetupProps {
  title: string;
  codexApiKeyInput: string;
}

export const CodexSetup: React.FC<CodexSetupProps> = ({ title, codexApiKeyInput }) => {
  return (
    <Box flexDirection="column" padding={1}>
      <Header title={title} />

      <Box marginBottom={1}>
        <Text color="blue">🤖 OpenAI Codex Setup</Text>
      </Box>
      
      <Box marginBottom={1}>
        <Text color="whiteBright">Welcome to OpenAI Codex! Please enter your OpenAI API key:</Text>
      </Box>

      <Box marginBottom={1}>
        <Text color="whiteBright">Get your API key from: </Text>
        <Text color="blue">https://platform.openai.com/api-keys</Text>
      </Box>

      <Box marginBottom={1}>
        <Text color="gray">Note: This will be used to authenticate with Codex CLI</Text>
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
        {codexApiKeyInput ? (
          <Text color="whiteBright">{"*".repeat(codexApiKeyInput.length)}</Text>
        ) : (
          <Text color="gray">Enter your OpenAI API key</Text>
        )}
        <Text color="gray">█</Text>
      </Box>

      <Box marginTop={1}>
        <Text color="gray">Enter your API key and press Enter to save</Text>
      </Box>
    </Box>
  );
};