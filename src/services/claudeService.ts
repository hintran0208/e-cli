import { query } from '@anthropic-ai/claude-code';
import { ProcessResult } from '../types/index.js';

export interface ClaudeCommand {
  type: 'prompt' | 'cli';
  content: string;
}

export class ClaudeService {
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

  static async executeCommand(claudeCommand: ClaudeCommand): Promise<ProcessResult> {
    try {
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
      for await (const message of query({
        prompt: claudeCommand.content,
        options: { maxTurns: 1 }
      })) {
        messages.push(message);
      }
      
      if (messages.length === 0) {
        return {
          success: false,
          output: '❌ No response received from Claude',
          error: 'Empty response'
        };
      }
      
      // Find the result message
      const resultMessage = messages.find(msg => msg.type === 'result' && msg.subtype === 'success');
      const assistantMessages = messages.filter(msg => msg.type === 'assistant');
      
      let responseText = '';
      
      if (resultMessage && 'result' in resultMessage) {
        responseText = resultMessage.result;
      } else if (assistantMessages.length > 0) {
        // Get text content from assistant messages
        const lastAssistant = assistantMessages[assistantMessages.length - 1];
        if (lastAssistant.message?.content) {
          const content = lastAssistant.message.content;
          if (Array.isArray(content)) {
            responseText = content
              .filter(block => block.type === 'text')
              .map(block => block.text)
              .join('');
          } else {
            responseText = String(content);
          }
        }
      }
      
      if (!responseText) {
        responseText = 'Response received but no text content found';
      }
      
      return {
        success: true,
        output: responseText
      };
      
    } catch (error: any) {
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