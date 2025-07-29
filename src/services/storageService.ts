import fs from 'fs';
import path from 'path';
import os from 'os';

interface StoredCredentials {
  anthropicApiKey?: string;
  geminiApiKey?: string;
}

const CONFIG_DIR = path.join(os.homedir(), '.ecli');
const CREDENTIALS_FILE = path.join(CONFIG_DIR, 'credentials.json');

export class StorageService {
  private static ensureConfigDir(): void {
    if (!fs.existsSync(CONFIG_DIR)) {
      fs.mkdirSync(CONFIG_DIR, { recursive: true });
    }
  }

  static saveCredentials(credentials: StoredCredentials): void {
    try {
      this.ensureConfigDir();
      
      let existingCredentials: StoredCredentials = {};
      if (fs.existsSync(CREDENTIALS_FILE)) {
        const fileContent = fs.readFileSync(CREDENTIALS_FILE, 'utf8');
        existingCredentials = JSON.parse(fileContent);
      }

      const updatedCredentials = { ...existingCredentials, ...credentials };
      fs.writeFileSync(CREDENTIALS_FILE, JSON.stringify(updatedCredentials, null, 2));
    } catch (error) {
      console.error('Error saving credentials:', error);
    }
  }

  static loadCredentials(): StoredCredentials {
    try {
      if (fs.existsSync(CREDENTIALS_FILE)) {
        const fileContent = fs.readFileSync(CREDENTIALS_FILE, 'utf8');
        return JSON.parse(fileContent);
      }
    } catch (error) {
      console.error('Error loading credentials:', error);
    }
    return {};
  }

  static clearCredentials(): void {
    try {
      if (fs.existsSync(CREDENTIALS_FILE)) {
        fs.unlinkSync(CREDENTIALS_FILE);
      }
    } catch (error) {
      console.error('Error clearing credentials:', error);
    }
  }

  static saveAnthropicApiKey(apiKey: string): void {
    this.saveCredentials({ anthropicApiKey: apiKey });
    process.env.ANTHROPIC_API_KEY = apiKey;
  }

  static saveGeminiApiKey(apiKey: string): void {
    this.saveCredentials({ geminiApiKey: apiKey });
    process.env.GEMINI_API_KEY = apiKey;
  }

  static loadAndSetEnvironmentVariables(): { isClaudeAuthenticated: boolean; isGeminiAuthenticated: boolean } {
    const credentials = this.loadCredentials();
    
    if (credentials.anthropicApiKey) {
      process.env.ANTHROPIC_API_KEY = credentials.anthropicApiKey;
    }
    
    if (credentials.geminiApiKey) {
      process.env.GEMINI_API_KEY = credentials.geminiApiKey;
    }

    return {
      isClaudeAuthenticated: !!credentials.anthropicApiKey,
      isGeminiAuthenticated: !!credentials.geminiApiKey
    };
  }

  static logout(): void {
    this.clearCredentials();
    delete process.env.ANTHROPIC_API_KEY;
    delete process.env.GEMINI_API_KEY;
  }
}