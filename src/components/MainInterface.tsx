import React from 'react';
import { Box, Text } from 'ink';
import { Header } from './Header.js';
import { InputField } from './InputField.js';
import { LoadingIndicator } from './LoadingIndicator.js';
import { ResponseDisplay } from './ResponseDisplay.js';
import { CommandDropdown } from './CommandDropdown.js';
import { ConversationHistory } from './ConversationHistory.js';
import { Command, ConversationMessage } from '../types/index.js';

interface MainInterfaceProps {
  title: string;
  input: string;
  cursorPosition: number;
  isExecuting: boolean;
  loadingDots: number;
  currentService: 'claude' | 'gemini' | 'codex' | '';
  responseText: string;
  isStreaming: boolean;
  streamingText: string;
  showCommandDropdown: boolean;
  selectedCommandIndex: number;
  availableCommands: Command[];
  showWelcome: boolean;
  conversationHistory: ConversationMessage[];
}

export const MainInterface: React.FC<MainInterfaceProps> = ({
  title,
  input,
  cursorPosition,
  isExecuting,
  loadingDots,
  currentService,
  responseText,
  isStreaming,
  streamingText,
  showCommandDropdown,
  selectedCommandIndex,
  availableCommands,
  showWelcome,
  conversationHistory
}) => {
  return (
    <Box flexDirection="column" height="100%" padding={1}>
      <Header title={title} />

      {showWelcome && (
        <Box flexDirection="column" marginBottom={2}>
          <Box marginBottom={1}>
            <Text color="whiteBright">Tips for getting started:</Text>
          </Box>
          <Text color="whiteBright">• Be specific for the best results</Text>
          <Box>
            <Text color="whiteBright">• </Text>
            <Text color="blue">/setup</Text>
            <Text color="whiteBright"> to initialize configuration and switch between different modes</Text>
          </Box>
          <Box>
            <Text color="whiteBright">• </Text>
            <Text color="blue">/help</Text>
            <Text color="whiteBright"> for more information</Text>
          </Box>
        </Box>
      )}

      {/* Chat Messages Area - Scrollable */}
      <Box flexDirection="column" flexGrow={1} overflowY="hidden">
        <ConversationHistory messages={conversationHistory} />

        {/* Show loading indicator as the latest message when executing */}
        {isExecuting && (
          <Box marginTop={1}>
            <LoadingIndicator loadingDots={loadingDots} currentService={currentService} />
            {isStreaming && streamingText && (
              <Box marginTop={1}>
                <Box flexDirection="column">
                  <Box marginBottom={0}>
                    <Text color="blue" bold>
                      {currentService === 'claude' ? '🧠' : currentService === 'gemini' ? '🤖' : '⚡'} Assistant ({currentService}):
                    </Text>
                  </Box>
                  <Box paddingLeft={2}>
                    <ResponseDisplay responseText={streamingText} />
                  </Box>
                </Box>
              </Box>
            )}
          </Box>
        )}
      </Box>

      {/* Input Area - Always at bottom */}
      <Box flexDirection="column" marginTop={1}>
        <InputField input={input} cursorPosition={cursorPosition} />
        {showCommandDropdown && (
          <CommandDropdown 
            commands={availableCommands}
            selectedCommandIndex={selectedCommandIndex}
          />
        )}
      </Box>
    </Box>
  );
};