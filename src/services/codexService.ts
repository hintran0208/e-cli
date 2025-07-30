import { spawn } from 'child_process';
import { CodexCommand, ProcessResult } from '../types/index.js';
import { StorageService } from './storageService.js';
import { getDefaultModel } from '../config/models.js';

export class CodexService {
  static getSelectedModel(): string {
    const models = StorageService.getSelectedModels();
    return models.codex || getDefaultModel('codex');
  }

  static parseCommand(command: string): CodexCommand {
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

  static async executeCommand(codexCommand: CodexCommand): Promise<ProcessResult> {
    return new Promise((resolve) => {
      // Handle CLI commands properly
      if (codexCommand.type === 'cli') {
        let codexArgs: string[];
        
        // Map CLI commands to proper flags
        if (codexCommand.content === 'help') {
          codexArgs = ['--help'];
        } else if (codexCommand.content === 'version') {
          codexArgs = ['--version'];
        } else {
          // For other CLI commands, treat them as prompts to the AI model using exec
          codexArgs = ['exec', '-m', this.getSelectedModel(), `/${codexCommand.content}`];
        }
        
        const codexProcess = spawn('npx', ['codex'].concat(codexArgs), {
          stdio: 'pipe',
          shell: false,
          env: { ...process.env, OPENAI_API_KEY: process.env.OPENAI_API_KEY }
        });

        let output = '';
        let errorOutput = '';

        codexProcess.stdout?.on('data', (data: any) => {
          output += data.toString();
        });

        codexProcess.stderr?.on('data', (data: any) => {
          errorOutput += data.toString();
        });

        codexProcess.on('close', (code: number | null) => {
          // Clean the output
          let cleanOutput = output.trim();
          
          resolve({
            success: code === 0 && cleanOutput.length > 0,
            output: cleanOutput || errorOutput.trim() || `No output received for /${codexCommand.content}`,
            error: code !== 0 ? errorOutput : undefined
          });
        });

        codexProcess.on('error', (error: any) => {
          resolve({
            success: false,
            output: `❌ Failed to execute Codex CLI: ${error.message}`,
            error: error.message
          });
        });

        return;
      }
      
      // For prompts, use exec mode with model and prompt (as single argument)
      const codexProcess = spawn('npx', ['codex', 'exec', '-m', this.getSelectedModel(), codexCommand.content], {
        stdio: 'pipe',
        shell: false,
        env: { ...process.env, OPENAI_API_KEY: process.env.OPENAI_API_KEY }
      });

      let output = '';
      let errorOutput = '';

      codexProcess.stdout?.on('data', (data: any) => {
        output += data.toString();
      });

      codexProcess.stderr?.on('data', (data: any) => {
        errorOutput += data.toString();
      });

      codexProcess.on('close', (code: number | null) => {
        if (code === 0) {
          // Clean the output - extract just the response content
          let cleanOutput = output.trim();
          
          // Extract the actual response from Codex output
          const lines = cleanOutput.split('\n');
          let responseStarted = false;
          let responseLines = [];
          
          for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            // Look for the actual assistant response (after "codex" line)
            if (line.trim() === 'codex' || line.includes('] codex')) {
              responseStarted = true;
              continue;
            }
            // Stop at tokens used line
            if (line.includes('tokens used:')) {
              break;
            }
            // Collect response lines
            if (responseStarted && line.trim() !== '') {
              responseLines.push(line);
            }
          }
          
          const finalResponse = responseLines.length > 0 
            ? responseLines.join('\n').trim()
            : cleanOutput;
          
          resolve({
            success: true,
            output: finalResponse || 'Command executed successfully but no output returned'
          });
        } else {
          let errorMsg = "❌ Error from Codex CLI:\n";
          if (errorOutput.includes('API key') || errorOutput.includes('authentication') || errorOutput.includes('login')) {
            errorMsg += "Please run 'npx codex login' to authenticate with OpenAI";
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

      codexProcess.on('error', (error: any) => {
        resolve({
          success: false,
          output: `❌ Failed to execute Codex CLI: ${error.message}\nMake sure Codex CLI is installed`,
          error: error.message
        });
      });
    });
  }
}