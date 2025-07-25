import React from 'react';
import { Box, Text } from 'ink';
import { Header } from './Header.js';

interface ClaudeSetupProps {
  title: string;
  claudeApiKeyInput: string;
}

export const ClaudeSetup: React.FC<ClaudeSetupProps> = ({ title, claudeApiKeyInput }) => {
  return (
    <Box flexDirection="column" padding={1}>
      <Header title={title} />

      <Box marginBottom={1}>
        <Text color="blue">🤖 Claude Code Setup</Text>
      </Box>
      
      <Box marginBottom={1}>
        <Text color="whiteBright">Welcome to Claude Code! Please enter your Anthropic API key:</Text>
      </Box>

      <Box marginBottom={1}>
        <Text color="whiteBright">Get your API key from:</Text>
        <Text color="blue">https://console.anthropic.com/</Text>
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
        {claudeApiKeyInput ? (
          <Text color="whiteBright">{"*".repeat(claudeApiKeyInput.length)}</Text>
        ) : (
          <Text color="gray">Enter your Anthropic API key</Text>
        )}
        <Text color="gray">█</Text>
      </Box>

      <Box marginTop={1}>
        <Text color="gray">Enter your API key and press Enter to save</Text>
      </Box>
    </Box>
  );
};