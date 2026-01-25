// Content moderation for user-submitted letters
// Blocks obvious spam, URLs, and offensive content

// URL patterns to block
const URL_PATTERNS = [
  /https?:\/\/[^\s]+/gi,
  /www\.[^\s]+/gi,
  /[a-z0-9]+\.(com|net|org|io|co|br|me|info|biz|xyz|tk|ml|ga|cf|gq)[^\s]*/gi,
];

// Spam keywords to block (case-insensitive)
const SPAM_KEYWORDS = [
  'compre agora',
  'clique aqui',
  'grátis',
  'ganhe dinheiro',
  'trabalhe em casa',
  'renda extra',
  'promoção imperdível',
  'oferta limitada',
  'não perca',
  'desconto exclusivo',
  'casino',
  'apostas',
  'bet365',
  'pixbet',
  'viagra',
  'crypto',
  'bitcoin',
  'invest',
  'telegram',
  'whatsapp',
  'zap',
];

// Basic profanity filter (Portuguese)
// Note: This is intentionally limited to obvious cases
const PROFANITY_WORDS = [
  'porra',
  'caralho',
  'foda-se',
  'fodase',
  'arrombado',
  'cuzão',
  'buceta',
  'piroca',
  'pau no cu',
];

export interface ModerationResult {
  isBlocked: boolean;
  reason: string | null;
}

export function moderateContent(content: string): ModerationResult {
  const lowerContent = content.toLowerCase();

  // Check for URLs
  for (const pattern of URL_PATTERNS) {
    if (pattern.test(content)) {
      return {
        isBlocked: true,
        reason: 'Links não são permitidos nas cartas',
      };
    }
  }

  // Check for spam keywords
  for (const keyword of SPAM_KEYWORDS) {
    if (lowerContent.includes(keyword.toLowerCase())) {
      return {
        isBlocked: true,
        reason: 'Conteúdo identificado como spam',
      };
    }
  }

  // Check for profanity
  for (const word of PROFANITY_WORDS) {
    if (lowerContent.includes(word.toLowerCase())) {
      return {
        isBlocked: true,
        reason: 'Conteúdo inapropriado detectado',
      };
    }
  }

  return {
    isBlocked: false,
    reason: null,
  };
}
