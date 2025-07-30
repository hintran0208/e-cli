import { query } from '@anthropic-ai/claude-code';
import { ProcessResult } from '../types/index.js';
import { StorageService } from './storageService.js';
import { getDefaultModel } from '../config/models.js';

export interface ClaudeCommand {
  type: 'prompt' | 'cli';
  content: string;
}

export class ClaudeService {
  static getSelectedModel(): string {
    const models = StorageService.getSelectedModels();
    return models.claude || getDefaultModel('claude');
  }

  static parseCommand(command: string): ClaudeCommand {
    const isQuotedPrompt = (command.startsWith('"') && command.endsWith('"')) || 
                          (command.startsWith("'") && command.endsWith("'"));
    const isCLICommand = command.startsWith('/');
    
    if (isQuotedPrompt) {
      return {
        type: 'prompt',
        content: command.slice(1, -1) // Remove quotes
      };
    } else if (isCLICommand) {
      return {
        type: 'cli',
        content: command.substring(1) // Remove the /
      };
    } else {
      return {
        type: 'prompt',
        content: command
      };
    }
  }

  static async executeCommandWithStreaming(
    claudeCommand: ClaudeCommand,
    onStreamUpdate?: (text: string) => void
  ): Promise<ProcessResult> {
    try {
      // Check if API key is set
      if (!process.env.ANTHROPIC_API_KEY) {
        return {
          success: false,
          output: '❌ ANTHROPIC_API_KEY environment variable not set. Please run "ecli claude" without arguments to set up your API key.',
          error: 'Missing API key'
        };
      }

      // Handle CLI commands
      if (claudeCommand.type === 'cli') {
        if (claudeCommand.content === 'help') {
          return {
            success: true,
            output: `Claude Code Commands:
• /help - Show this help message
• /version - Show Claude Code version
• Or use regular prompts for AI assistance`
          };
        } else if (claudeCommand.content === 'version') {
          return {
            success: true,
            output: '1.0.59 (Claude Code SDK)'
          };
        } else {
          // Treat other CLI commands as prompts
          claudeCommand = { type: 'prompt', content: claudeCommand.content };
        }
      }
      
      // Execute prompt using Claude Code SDK with streaming
      const messages = [];
      const allTextResponses: string[] = [];
      
      for await (const message of query({
        prompt: claudeCommand.content,
        options: { 
          maxTurns: 10,
          model: this.getSelectedModel()
        }
      })) {
        messages.push(message);
        
        // Stream assistant responses in real-time
        if (message.type === 'assistant' && message.message?.content && Array.isArray(message.message.content)) {
          const textBlocks = message.message.content.filter((block: any) => block.type === 'text');
          
          if (textBlocks.length > 0) {
            const messageText = textBlocks.map((block: any) => block.text).join('');
            if (messageText.trim()) {
              allTextResponses.push(messageText);
              
              // Stream the accumulated response
              if (onStreamUpdate) {
                onStreamUpdate(allTextResponses.join('\n\n'));
              }
            }
          }
        }
      }
      
      const responseText = allTextResponses.length > 0 
        ? allTextResponses.join('\n\n')
        : 'Response received but no text content found';
      
      return {
        success: true,
        output: responseText
      };
      
    } catch (error: any) {
      console.error('Claude Code SDK Error:', error);
      let errorMsg = "❌ Error from Claude Code SDK:\n";
      
      if (error.message?.includes('API key') || error.message?.includes('authentication')) {
        errorMsg += "Please set your ANTHROPIC_API_KEY environment variable or authenticate with Claude CLI";
      } else if (error.message?.includes('rate limit')) {
        errorMsg += "Rate limit exceeded. Please try again later.";
      } else {
        errorMsg += error.message || "Unknown error occurred";
      }
      
      return {
        success: false,
        output: errorMsg,
        error: error.message
      };
    }
  }

  static async executeCommand(claudeCommand: ClaudeCommand): Promise<ProcessResult> {
    try {
      // Check if API key is set
      if (!process.env.ANTHROPIC_API_KEY) {
        return {
          success: false,
          output: '❌ ANTHROPIC_API_KEY environment variable not set. Please run "ecli claude" without arguments to set up your API key.',
          error: 'Missing API key'
        };
      }

      // Handle CLI commands
      if (claudeCommand.type === 'cli') {
        if (claudeCommand.content === 'help') {
          return {
            success: true,
            output: `Claude Code Commands:
• /help - Show this help message
• /version - Show Claude Code version
• Or use regular prompts for AI assistance`
          };
        } else if (claudeCommand.content === 'version') {
          return {
            success: true,
            output: '1.0.59 (Claude Code SDK)'
          };
        } else {
          // Treat other CLI commands as prompts
          claudeCommand = { type: 'prompt', content: claudeCommand.content };
        }
      }
      
      // Execute prompt using Claude Code SDK
      const messages = [];
      
      console.log('Executing Claude query with prompt:', claudeCommand.content);
      
      for await (const message of query({
        prompt: claudeCommand.content,
        options: { 
          maxTurns: 10,
          model: this.getSelectedModel()
        }
      })) {
        console.log('Received message type:', message.type);
        console.log('Full message:', JSON.stringify(message, null, 2));
        messages.push(message);
      }
      
      console.log('Total messages received:', messages.length);
      
      if (messages.length === 0) {
        return {
          success: false,
          output: '❌ No response received from Claude',
          error: 'Empty response'
        };
      }
      
      // Try to extract response from different message types
      let responseText = '';
      
      // Method 1: Collect all assistant text messages in order
      const assistantMessages = messages.filter(msg => msg.type === 'assistant');
      console.log('Assistant messages found:', assistantMessages.length);
      
      const allTextResponses: string[] = [];
      
      if (assistantMessages.length > 0) {
        for (const assistantMsg of assistantMessages) {
          if (assistantMsg.message?.content && Array.isArray(assistantMsg.message.content)) {
            const textBlocks = assistantMsg.message.content.filter((block: any) => block.type === 'text');
            
            if (textBlocks.length > 0) {
              const messageText = textBlocks.map((block: any) => block.text).join('');
              if (messageText.trim()) {
                allTextResponses.push(messageText);
                console.log('Added text response:', messageText.substring(0, 100) + '...');
              }
            }
          }
        }
      }
      
      if (allTextResponses.length > 0) {
        responseText = allTextResponses.join('\n\n');
        console.log('Combined response length:', responseText.length);
      }
      
      // Method 2: Look for result messages
      if (!responseText) {
        const resultMessages = messages.filter(msg => msg.type === 'result');
        console.log('Result messages found:', resultMessages.length);
        
        for (const resultMsg of resultMessages) {
          console.log('Processing result message:', JSON.stringify(resultMsg, null, 2));
          
          if ('result' in resultMsg && resultMsg.result) {
            responseText = String(resultMsg.result);
            console.log('Got result content:', responseText.substring(0, 100) + '...');
            break;
          }
        }
      }
      
      // Method 3: Look for any message with text content
      if (!responseText) {
        console.log('Searching all messages for text content...');
        for (const msg of messages) {
          if ('content' in msg && msg.content) {
            responseText = String(msg.content);
            console.log('Found content in message type:', msg.type, responseText.substring(0, 100) + '...');
            break;
          }
        }
      }
      
      if (!responseText) {
        console.log('No text content found in any message');
        console.log('All message types:', messages.map(m => m.type));
        responseText = 'Response received but no text content found. Check console for debug info.';
      }
      
      return {
        success: true,
        output: responseText
      };
      
    } catch (error: any) {
      console.error('Claude Code SDK Error:', error);
      let errorMsg = "❌ Error from Claude Code SDK:\n";
      
      if (error.message?.includes('API key') || error.message?.includes('authentication')) {
        errorMsg += "Please set your ANTHROPIC_API_KEY environment variable or authenticate with Claude CLI";
      } else if (error.message?.includes('rate limit')) {
        errorMsg += "Rate limit exceeded. Please try again later.";
      } else {
        errorMsg += error.message || "Unknown error occurred";
      }
      
      return {
        success: false,
        output: errorMsg,
        error: error.message
      };
    }
  }
}