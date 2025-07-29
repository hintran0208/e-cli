import React from 'react';
import { Box, Text } from 'ink';
import gradient from 'gradient-string';

interface ModelSelectionProps {
  title: string;
  availableModels: string[];
  selectedModelIndex: number;
  provider: 'claude' | 'gemini' | 'codex';
}

const ModelSelection: React.FC<ModelSelectionProps> = ({ 
  title, 
  availableModels, 
  selectedModelIndex,
  provider 
}) => {
  const gradientTitle = gradient(['#ff6b6b', '#4ecdc4', '#45b7d1'])(title);
  const providerName = provider === 'claude' ? 'Claude' : provider === 'gemini' ? 'Gemini' : 'Codex';

  return (
    <Box flexDirection="column" alignItems="center">
      <Text>{gradientTitle}</Text>
      <Box marginTop={1}>
        <Text color="cyan">🤖 Select {providerName} Model</Text>
      </Box>
      
      <Box marginTop={2} flexDirection="column">
        {availableModels.map((model, index) => (
          <Box key={model} marginY={0}>
            <Text color={index === selectedModelIndex ? 'green' : 'white'}>
              {index === selectedModelIndex ? '▶ ' : '  '}
              {model}
              {index === selectedModelIndex ? ' ◀' : ''}
            </Text>
          </Box>
        ))}
      </Box>

      <Box marginTop={2}>
        <Text color="gray">Use ↑↓ arrows to navigate, Enter to select</Text>
      </Box>
    </Box>
  );
};

export default ModelSelection;