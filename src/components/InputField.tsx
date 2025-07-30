import React from 'react';
import { Box, Text } from 'ink';

interface InputFieldProps {
  input: string;
  cursorPosition: number;
  placeholder?: string;
}

export const InputField: React.FC<InputFieldProps> = ({ 
  input, 
  cursorPosition, 
  placeholder = "Type your message or @path/to/file" 
}) => {
  return (
    <Box
      marginTop={2}
      marginBottom={1}
      borderStyle="round"
      borderColor="blue"
      paddingLeft={1}
      paddingRight={1}
    >
      <Text color="blue">{"> "}</Text>
      {input ? (
        <>
          <Text color="whiteBright">{input.slice(0, cursorPosition)}</Text>
          <Text color="whiteBright" backgroundColor="whiteBright">{input.charAt(cursorPosition) || " "}</Text>
          <Text color="whiteBright">{input.slice(cursorPosition + 1)}</Text>
        </>
      ) : (
        <>
          <Text color="whiteBright" backgroundColor="whiteBright"> </Text>
          <Text color="gray">{placeholder}</Text>
        </>
      )}
    </Box>
  );
};