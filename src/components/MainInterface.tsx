import React from 'react';
import { Box, Text } from 'ink';
import { Header } from './Header.js';
import { InputField } from './InputField.js';
import { LoadingIndicator } from './LoadingIndicator.js';
import { ResponseDisplay } from './ResponseDisplay.js';

interface MainInterfaceProps {
  title: string;
  input: string;
  cursorPosition: number;
  isExecuting: boolean;
  loadingDots: number;
  currentService: 'claude' | 'gemini' | '';
  showResponse: boolean;
  responseText: string;
  isStreaming: boolean;
  streamingText: string;
}

export const MainInterface: React.FC<MainInterfaceProps> = ({
  title,
  input,
  cursorPosition,
  isExecuting,
  loadingDots,
  currentService,
  showResponse,
  responseText,
  isStreaming,
  streamingText
}) => {
  return (
    <Box flexDirection="column" padding={1}>
      <Header title={title} />

      <Box marginBottom={1}>
        <Text color="whiteBright">Tips for getting started:</Text>
      </Box>
      <Text color="whiteBright">• Be specific for the best results</Text>
      <Box>
        <Text color="whiteBright">• </Text>
        <Text color="blue">/setup</Text>
        <Text color="whiteBright"> to initialize your configuration</Text>
      </Box>
      <Box>
        <Text color="whiteBright">• </Text>
        <Text color="blue">/mode</Text>
        <Text color="whiteBright"> to switch between different modes</Text>
      </Box>
      <Box>
        <Text color="whiteBright">• </Text>
        <Text color="blue">/help</Text>
        <Text color="whiteBright"> for more information</Text>
      </Box>

      {!showResponse && (
        <>
          {isExecuting ? (
            <>
              <LoadingIndicator loadingDots={loadingDots} currentService={currentService} />
              {isStreaming && streamingText && (
                <Box marginTop={1} marginBottom={1}>
                  <ResponseDisplay responseText={streamingText} />
                </Box>
              )}
            </>
          ) : (
            <InputField input={input} cursorPosition={cursorPosition} />
          )}
        </>
      )}

      {showResponse && (
        <>
          <ResponseDisplay responseText={responseText || streamingText} />
          <InputField input={input} cursorPosition={cursorPosition} />
        </>
      )}
    </Box>
  );
};