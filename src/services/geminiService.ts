import { spawn } from 'child_process';
import { GeminiCommand, ProcessResult } from '../types/index.js';

export class GeminiService {
  static parseCommand(command: string): GeminiCommand {
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

  static async executeCommand(geminiCommand: GeminiCommand): Promise<ProcessResult> {
    return new Promise((resolve) => {
      let geminiArgs: string[];
      
      if (geminiCommand.type === 'prompt') {
        geminiArgs = ['gemini', '-p', geminiCommand.content];
      } else {
        geminiArgs = ['gemini', ...geminiCommand.content.split(' ')];
      }

      const geminiProcess = spawn('npx', geminiArgs, {
        stdio: 'pipe',
        shell: true
      });

      let output = '';
      let errorOutput = '';

      geminiProcess.stdout?.on('data', (data) => {
        output += data.toString();
      });

      geminiProcess.stderr?.on('data', (data) => {
        errorOutput += data.toString();
      });

      geminiProcess.on('close', (code) => {
        if (code === 0) {
          // Clean the output - remove cached credentials and extra whitespace
          let cleanOutput = output.trim();
          cleanOutput = cleanOutput.replace(/^Loaded cached credentials\.\s*\n?/gm, '');
          cleanOutput = cleanOutput.trim();
          
          resolve({
            success: true,
            output: cleanOutput
          });
        } else {
          let errorMsg = "❌ Error from Gemini CLI:\n";
          if (errorOutput.includes('API key')) {
            errorMsg += "Please set your API key using /mode setup";
          } else {
            errorMsg += errorOutput.trim() || "Unknown error occurred";
          }
          
          resolve({
            success: false,
            output: errorMsg,
            error: errorOutput
          });
        }
      });

      geminiProcess.on('error', (error) => {
        resolve({
          success: false,
          output: `❌ Failed to execute Gemini CLI: ${error.message}\nMake sure @google/gemini-cli is installed`,
          error: error.message
        });
      });
    });
  }
}