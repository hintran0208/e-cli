import React from 'react';
import { Box, Text } from 'ink';
import { ConversationMessage } from '../types/index.js';

interface ConversationHistoryProps {
  messages: ConversationMessage[];
}

export const ConversationHistory: React.FC<ConversationHistoryProps> = ({ messages }) => {
  if (messages.length === 0) {
    return null;
  }

  const getServiceIcon = (service?: 'claude' | 'gemini' | 'codex') => {
    switch (service) {
      case 'claude': return '🧠';
      case 'gemini': return '🤖';
      case 'codex': return '⚡';
      default: return '🤖';
    }
  };

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Box flexDirection="column">
      {messages.map((message, index) => (
        <Box key={message.id} flexDirection="column" marginBottom={1}>
          {message.type === 'user' ? (
            // User Message - Right aligned style
            <Box flexDirection="column">
              <Box marginBottom={0}>
                <Text color="green" bold>👤 You </Text>
                <Text color="gray" dimColor>{formatTime(message.timestamp)}</Text>
              </Box>
              <Box paddingLeft={2} paddingY={0}>
                <Text color="white">{message.content}</Text>
              </Box>
            </Box>
          ) : message.type === 'system' ? (
            // System Message - Emphasized style with bright colors
            <Box flexDirection="column">
              <Box marginBottom={0}>
                <Text color="yellow" bold>System </Text>
                <Text color="gray" dimColor>{formatTime(message.timestamp)}</Text>
              </Box>
              <Box paddingLeft={2} paddingY={0} borderStyle="round" borderColor="yellow" paddingX={1}>
                <Text color="yellowBright" bold>{message.content}</Text>
              </Box>
            </Box>
          ) : (
            // Assistant Message - Left aligned style  
            <Box flexDirection="column">
              <Box marginBottom={0}>
                <Text color="blue" bold>
                  {getServiceIcon(message.service)} Assistant{message.service ? ` (${message.service})` : ''} 
                </Text>
                <Text color="gray" dimColor>{formatTime(message.timestamp)}</Text>
              </Box>
              <Box paddingLeft={2} paddingY={0}>
                <Text color="white">{message.content}</Text>
              </Box>
            </Box>
          )}
          
          {/* Add separator line between conversations */}
          {index < messages.length - 1 && (
            <Box marginTop={0} marginBottom={0}>
              <Text color="gray">{'─'.repeat(50)}</Text>
            </Box>
          )}
        </Box>
      ))}
    </Box>
  );
};