import { Command } from '../types/index.js';

export const availableCommands: Command[] = [
  {
    name: '/hooks',
    description: 'Manage hook configurations for tool events',
    action: 'hooks'
  },
  {
    name: '/ide',
    description: 'Manage IDE integrations and show status',
    action: 'ide'
  },
  {
    name: '/init',
    description: 'Initialize a new CLAUDE.md file with codebase documentation',
    action: 'init'
  },
  {
    name: '/install-github-app',
    description: 'Set up Claude GitHub Actions for a repository',
    action: 'install-github-app'
  },
  {
    name: '/logout',
    description: 'Sign out from your Anthropic account',
    action: 'logout'
  },
  {
    name: '/mcp',
    description: 'Manage MCP servers',
    action: 'mcp'
  },
  {
    name: '/memory',
    description: 'Edit Claude memory files',
    action: 'memory'
  },
  {
    name: '/migrate-installer',
    description: 'Migrate from global npm installation to local installation',
    action: 'migrate-installer'
  },
  {
    name: '/model',
    description: 'Set the AI model for your configured provider',
    action: 'model'
  },
  {
    name: '/setup',
    description: 'Initialize configuration for your AI provider',
    action: 'setup'
  },
  {
    name: '/help',
    description: 'Show help information',
    action: 'help'
  }
];