ECLI - AI CLI Wrapper
====================

A unified CLI wrapper for Claude Code and Gemini CLI - Choose your AI assistant from the command line or let it default to your configured provider.

## Installation

```bash
npm install -g ecli
```

## Quick Start

1. **Set up your API keys:**
   ```bash
   ecli  # Run interactive setup to configure Claude or Gemini
   ```

2. **Use directly after setup:**
   ```bash
   ecli "help me debug this function"  # Uses your configured default provider
   ```

## Usage Patterns

### After API Key Setup
- **Simple usage**: `ecli "your prompt here"` - Uses your configured default provider
- **Explicit provider**: `ecli claude "your prompt"` or `ecli gemini "your prompt"`
- **Interactive mode**: Just run `ecli` for the interactive interface
## Configuration

### API Key Setup

1. **Interactive Setup:**
   ```bash
   ecli  # Opens interactive configuration
   ```
   - Choose your preferred AI provider (Claude or Gemini)
   - Enter your API key
   - Keys are stored securely in `~/.ecli/credentials.json`

2. **Manual API Key Setup:**
   - **Claude (Anthropic)**: Get your API key from [Claude Console](https://console.anthropic.com)
   - **Gemini**: Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

## Command Reference

### Basic Commands

- `ecli` - Interactive mode or runs default provider if configured
- `ecli "your prompt"` - Uses your default configured provider
- `ecli claude "your prompt"` - Explicitly use Claude Code
- `ecli gemini "your prompt"` - Explicitly use Gemini CLI

### Advanced Usage

- `ecli claude /help` - Show Claude Code CLI help
- `ecli gemini /help` - Show Gemini CLI help  
- `ecli /logout` - Clear all stored API keys

## Smart Defaults

After setup, ECLI automatically detects your configuration:

- **Only Claude configured**: `ecli` defaults to Claude Code
- **Only Gemini configured**: `ecli` defaults to Gemini CLI  
- **Both configured**: `ecli` shows interactive provider selection
- **Neither configured**: `ecli` shows setup wizard

## Features

- 🔐 Secure API key storage
- 🤖 Support for Claude Code and Gemini CLI
- 🚀 Smart provider detection and defaults
- 💬 Interactive configuration and selection
- 🔄 Easy provider switching
