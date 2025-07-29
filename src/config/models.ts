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

export const getModelsForProvider = (provider: 'claude' | 'gemini'): string[] => {
  switch (provider) {
    case 'claude':
      return CLAUDE_MODELS;
    case 'gemini':
      return GEMINI_MODELS;
    default:
      return [];
  }
};

export const getDefaultModel = (provider: 'claude' | 'gemini'): string => {
  switch (provider) {
    case 'claude':
      return 'sonnet';
    case 'gemini':
      return 'gemini-2.5-flash';
    default:
      return '';
  }
};