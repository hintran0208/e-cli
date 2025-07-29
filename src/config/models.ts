export const CLAUDE_MODELS = [
  'sonnet',
  'opus', 
  'haiku',
  'claude-sonnet-4-20250514',
  'claude-3-5-sonnet-20241022',
  'claude-3-5-haiku-20241022',
  'claude-3-opus-20240229'
];

export const GEMINI_MODELS = [
  'gemini-2.5-pro',
  'gemini-2.5-flash',
  'gemini-1.5-pro',
  'gemini-1.5-flash'
];

export const CODEX_MODELS = [
  'o4-mini',
  'gpt-4o',
  'gpt-4o-mini',
  'claude-3-5-sonnet-20241022',
  'gemini-2.0-flash-exp'
];

export const getModelsForProvider = (provider: 'claude' | 'gemini' | 'codex'): string[] => {
  switch (provider) {
    case 'claude':
      return CLAUDE_MODELS;
    case 'gemini':
      return GEMINI_MODELS;
    case 'codex':
      return CODEX_MODELS;
    default:
      return [];
  }
};

export const getDefaultModel = (provider: 'claude' | 'gemini' | 'codex'): string => {
  switch (provider) {
    case 'claude':
      return 'sonnet';
    case 'gemini':
      return 'gemini-2.5-flash';
    case 'codex':
      return 'o4-mini';
    default:
      return '';
  }
};