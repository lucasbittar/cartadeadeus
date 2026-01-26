// Content moderation for user-submitted letters
// Blocks obvious spam, URLs, and offensive content
// Flags suspicious content for manual review

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

// Borderline words that should flag for review (not block)
const BORDERLINE_WORDS = [
  'merda',
  'droga',
  'idiota',
  'imbecil',
  'otário',
  'babaca',
  'cretino',
  'desgraça',
];

export interface ModerationResult {
  isBlocked: boolean;
  reason: string | null;
}

export interface FlaggingResult {
  shouldFlag: boolean;
  flagReason: string | null;
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

/**
 * Check if content should be flagged for manual review
 * This runs after moderateContent() and catches borderline cases
 * that shouldn't be auto-blocked but need human review
 */
export function checkForFlagging(content: string): FlaggingResult {
  const lowerContent = content.toLowerCase();
  const reasons: string[] = [];

  // Check for repeated characters (5+ in a row) - potential spam
  if (/(.)\1{4,}/i.test(content)) {
    reasons.push('repeated_characters');
  }

  // Check for excessive caps (10+ consecutive uppercase letters)
  if (/[A-Z]{10,}/.test(content)) {
    reasons.push('excessive_caps');
  }

  // Check for very short content (less than 10 chars)
  if (content.trim().length < 10) {
    reasons.push('very_short');
  }

  // Check for multiple @ mentions (3+) - potential spam
  const mentionCount = (content.match(/@\w+/g) || []).length;
  if (mentionCount >= 3) {
    reasons.push('multiple_mentions');
  }

  // Check for borderline words
  for (const word of BORDERLINE_WORDS) {
    if (lowerContent.includes(word.toLowerCase())) {
      reasons.push('borderline_language');
      break;
    }
  }

  // Check for excessive punctuation (potential spam)
  const punctuationCount = (content.match(/[!?]{2,}/g) || []).length;
  if (punctuationCount >= 3) {
    reasons.push('excessive_punctuation');
  }

  if (reasons.length > 0) {
    return {
      shouldFlag: true,
      flagReason: reasons.join(', '),
    };
  }

  return {
    shouldFlag: false,
    flagReason: null,
  };
}
