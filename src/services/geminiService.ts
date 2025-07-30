import { spawn } from 'child_process';
import { GeminiCommand, ProcessResult } from '../types/index.js';
import { StorageService } from './storageService.js';
import { getDefaultModel } from '../config/models.js';

export class GeminiService {
  static getSelectedModel(): string {
    const models = StorageService.getSelectedModels();
    return models.gemini || getDefaultModel('gemini');
  }

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
      // Handle CLI commands properly
      if (geminiCommand.type === 'cli') {
        let geminiArgs: string[];
        
        // Map CLI commands to proper flags
        if (geminiCommand.content === 'help') {
          geminiArgs = ['--help'];
        } else if (geminiCommand.content === 'version') {
          geminiArgs = ['--version'];
        } else {
          // For other CLI commands, treat them as prompts to the AI model
          geminiArgs = ['-m', this.getSelectedModel(), '-p', `/${geminiCommand.content}`];
        }
        
        const geminiProcess = spawn('npx', ['gemini'].concat(geminiArgs), {
          stdio: 'pipe',
          shell: true
        });

        let output = '';
        let errorOutput = '';

        geminiProcess.stdout?.on('data', (data: any) => {
          output += data.toString();
        });

        geminiProcess.stderr?.on('data', (data: any) => {
          errorOutput += data.toString();
        });

        geminiProcess.on('close', (code: number | null) => {
          // Clean the output
          let cleanOutput = output.trim();
          cleanOutput = cleanOutput.replace(/^Loaded cached credentials\.\s*\n?/gm, '');
          cleanOutput = cleanOutput.trim();
          
          resolve({
            success: code === 0 && cleanOutput.length > 0,
            output: cleanOutput || errorOutput.trim() || `No output received for /${geminiCommand.content}`,
            error: code !== 0 ? errorOutput : undefined
          });
        });

        geminiProcess.on('error', (error: any) => {
          resolve({
            success: false,
            output: `❌ Failed to execute Gemini CLI: ${error.message}`,
            error: error.message
          });
        });

        return;
      }
      
      // For prompts, use -p flag with selected model
      const geminiProcess = spawn('npx', ['gemini', '-m', this.getSelectedModel(), '-p', geminiCommand.content], {
        stdio: 'pipe',
        shell: true
      });

      let output = '';
      let errorOutput = '';

      geminiProcess.stdout?.on('data', (data: any) => {
        output += data.toString();
      });

      geminiProcess.stderr?.on('data', (data: any) => {
        errorOutput += data.toString();
      });

      geminiProcess.on('close', (code: number | null) => {
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

      geminiProcess.on('error', (error: any) => {
        resolve({
          success: false,
          output: `❌ Failed to execute Gemini CLI: ${error.message}\nMake sure @google/gemini-cli is installed`,
          error: error.message
        });
      });
    });
  }
}