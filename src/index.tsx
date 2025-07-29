#!/usr/bin/env node
import React from 'react';
import { render, Text } from 'ink';
import { spawn } from 'child_process';
import * as pty from 'node-pty';
import App from './App.js';
import { StorageService } from './services/storageService.js';
import { GeminiService } from './services/geminiService.js';
import { ClaudeService } from './services/claudeService.js';

const args = process.argv.slice(2);
const command = args[0];

// Load stored credentials to determine default behavior
const { isClaudeAuthenticated, isGeminiAuthenticated } = StorageService.loadAndSetEnvironmentVariables();

// Handle claude subcommand - make it work exactly like the @anthropic-ai/claude-code package
if (command === 'claude') {
  // Get all arguments after 'claude'
  const claudeArgs = args.slice(1);
  
  // Launch @anthropic-ai/claude-code with all the arguments - exactly like calling claude directly
  const claudeArgs2 = ['--model', ClaudeService.getSelectedModel()].concat(claudeArgs);
  const claudeProcess = spawn('npx', ['@anthropic-ai/claude-code'].concat(claudeArgs2), {
    stdio: 'inherit',
    shell: true
  });
  
  claudeProcess.on('close', (exitCode) => {
    process.exit(exitCode || 0);
  });
  
  claudeProcess.on('error', (error) => {
    console.error(`Error spawning claude process: ${error.message}`);
    console.error('Make sure @anthropic-ai/claude-code is installed');
    process.exit(1);
  });
} else if (command === 'gemini') {
  // Check if gemini CLI is available first
  const checkGemini = spawn('which', ['gemini'], { shell: true });
  
  checkGemini.on('close', (code) => {
    if (code !== 0) {
      console.error('Error: Gemini CLI is not available. Please install it first.');
      process.exit(1);
    }
    
    // Get all arguments after 'gemini'
    const geminiArgs = args.slice(1);
    
    // For /help command, use PTY to properly interact with Gemini CLI
    if (geminiArgs.length === 1 && geminiArgs[0] === '/help') {
      console.log('🔍 Launching Gemini CLI to show help...\n');
      
      // Use PTY to create a proper pseudo-terminal for Gemini CLI
      const ptyProcess = pty.spawn('gemini', ['-m', GeminiService.getSelectedModel()], {
        name: 'xterm-color',
        cols: 80,
        rows: 30,
        cwd: process.cwd(),
        env: process.env
      });

      let helpShown = false;
      let loadingComplete = false;
      let attempts = 0;
      const maxAttempts = 3;

      // Buffer to collect output
      let outputBuffer = '';

      ptyProcess.onData((data) => {
        // Forward output to console
        process.stdout.write(data);
        outputBuffer += data;

        // Check if Gemini CLI is ready for input
        if (!loadingComplete && (data.includes('Type your message') || data.includes('╰'))) {
          loadingComplete = true;
          setTimeout(() => {
            if (!helpShown && attempts < maxAttempts) {
              attempts++;
              ptyProcess.write('/help\r');
            }
          }, 1500);
        }

        // Check if help content is being displayed
        if (data.includes('Commands:') || data.includes('Basics:') || data.includes('/clear')) {
          helpShown = true;
          // Wait for help to complete, then quit
          setTimeout(() => {
            ptyProcess.write('/quit\r');
          }, 8000);
        }

        // Handle authentication prompts - cancel them to get to main interface
        if (data.includes('Waiting for auth') && data.includes('ESC to cancel')) {
          ptyProcess.write('\x1b'); // Send ESC key
          setTimeout(() => {
            loadingComplete = false; // Reset so we can try sending /help again
          }, 2000);
        }

        // Handle authentication selection screen - cancel it
        if (data.includes('How would you like to authenticate') || data.includes('Login with Google')) {
          ptyProcess.write('\x1b'); // Send ESC key to cancel
          setTimeout(() => {
            loadingComplete = false; // Reset so we can try sending /help again
          }, 2000);
        }

        // If we see AI agent response instead of help, try again
        if (data.includes('I am a CLI agent') && !helpShown && attempts < maxAttempts) {
          setTimeout(() => {
            attempts++;
            ptyProcess.write('/help\r');
          }, 1000);
        }
      });

      ptyProcess.onExit((exitCode) => {
        if (!helpShown) {
          console.log('\n❌ Could not retrieve help automatically.');
          console.log('\nTo see Gemini CLI help manually:');
          console.log(`1. Run: gemini -m ${GeminiService.getSelectedModel()}`);
          console.log('2. Wait for interface to load');
          console.log('3. Type: /help');
        }
        process.exit(exitCode.exitCode || 0);
      });

      // Timeout after 60 seconds
      setTimeout(() => {
        if (!helpShown) {
          console.log('\n⏱️  Timeout. Try running manually:');
          console.log(`1. gemini -m ${GeminiService.getSelectedModel()}`);
          console.log('2. Type: /help');
          ptyProcess.kill();
        }
      }, 60000);

      return;
    }
    
    // Add selected model to avoid quota issues for other commands
    const finalArgs = ['-m', GeminiService.getSelectedModel(), ...geminiArgs];
    
    // Launch gemini with all the arguments - exactly like calling gemini directly
    const geminiProcess = spawn('gemini', finalArgs, {
      stdio: 'inherit'
    });
    
    geminiProcess.on('close', (exitCode) => {
      process.exit(exitCode || 0);
    });
    
    geminiProcess.on('error', (error) => {
      console.error(`Error spawning gemini process: ${error.message}`);
      process.exit(1);
    });
  });
  
  checkGemini.on('error', () => {
    console.error('Error: Gemini CLI is not available. Please install it first.');
    process.exit(1);
  });
} else {
  // No subcommand provided - check for configured API keys and default behavior
  if (args.length === 0) {
    // Just "ecli" with no arguments - determine default provider
    if (isClaudeAuthenticated && !isGeminiAuthenticated) {
      // Only Claude is configured - launch interactive Claude
      render(<App />);
    } else if (isGeminiAuthenticated && !isClaudeAuthenticated) {
      // Only Gemini is configured - launch interactive Gemini with selected model
      const geminiProcess = spawn('gemini', ['-m', GeminiService.getSelectedModel()], {
        stdio: 'inherit'
      });
      
      geminiProcess.on('close', (exitCode) => {
        process.exit(exitCode || 0);
      });
      
      geminiProcess.on('error', (error) => {
        console.error(`Error spawning gemini process: ${error.message}`);
        console.error('Make sure Gemini CLI is installed');
        process.exit(1);
      });
    } else if (isClaudeAuthenticated && isGeminiAuthenticated) {
      // Both are configured - show interactive selection
      render(<App />);
    } else {
      // Neither is configured - show setup
      render(<App />);
    }
  } else {
    // Arguments provided without subcommand - route to default provider
    if (isClaudeAuthenticated && !isGeminiAuthenticated) {
      // Default to Claude
      const claudeArgs = ['--model', ClaudeService.getSelectedModel()].concat(args);
      const claudeProcess = spawn('npx', ['@anthropic-ai/claude-code'].concat(claudeArgs), {
        stdio: 'inherit',
        shell: true
      });
      
      claudeProcess.on('close', (exitCode) => {
        process.exit(exitCode || 0);
      });
      
      claudeProcess.on('error', (error) => {
        console.error(`Error spawning claude process: ${error.message}`);
        console.error('Make sure @anthropic-ai/claude-code is installed');
        process.exit(1);
      });
    } else if (isGeminiAuthenticated && !isClaudeAuthenticated) {
      // Default to Gemini - use prompt mode
      const prompt = args.join(' ');
      const finalArgs = ['-m', GeminiService.getSelectedModel(), '-p', prompt];
      const geminiProcess = spawn('gemini', finalArgs, {
        stdio: 'inherit'
      });
      
      geminiProcess.on('close', (exitCode) => {
        process.exit(exitCode || 0);
      });
      
      geminiProcess.on('error', (error) => {
        console.error(`Error spawning gemini process: ${error.message}`);
        console.error('Make sure Gemini CLI is installed');
        process.exit(1);
      });
    } else {
      // Both configured or neither configured - show interactive CLI for selection
      render(<App />);
    }
  }
}