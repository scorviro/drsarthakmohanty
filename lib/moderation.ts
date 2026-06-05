// A simple and robust Auto-Moderation Engine for reviews.

const BLOCKLIST_WORDS = [
  "spam", "fake", "scam", "fraud", "scammer", "scammed", "cheater", "cheat",
  "fuck", "shit", "bitch", "asshole", "idiot", "stupid", "bastard", "crap",
  "quack", "kill", "die", "useless", "worst"
];

const LINK_REGEX = /(https?:\/\/[^\s]+)|(www\.[^\s]+)|([a-zA-Z0-9-]+\.(com|net|org|edu|gov|mil|int|biz|info|io|co|in|us|me|tv|xyz|online|shop|site|tech))/gi;

interface ModerationResult {
  isValid: boolean;
  reason?: string;
  cleanedText?: string;
  cleanedTitle?: string;
}

export function moderateReview(title: string, reviewText: string): ModerationResult {
  // Check empty
  if (!title || title.trim().length < 3) {
    return { isValid: false, reason: "Title must be at least 3 characters long." };
  }
  if (!reviewText || reviewText.trim().length < 10) {
    return { isValid: false, reason: "Review text must be at least 10 characters long." };
  }

  // Check size limits
  if (title.length > 100) {
    return { isValid: false, reason: "Title is too long (maximum 100 characters)." };
  }
  if (reviewText.length > 1000) {
    return { isValid: false, reason: "Review text is too long (maximum 1000 characters)." };
  }

  // Check spam links/URLs
  if (LINK_REGEX.test(title) || LINK_REGEX.test(reviewText)) {
    return { isValid: false, reason: "Spam check failed: Links and URLs are not allowed in patient reviews." };
  }

  // Check profanity / blocklist words
  let cleanedTitle = title;
  let cleanedText = reviewText;
  let hasBlockedWord = false;

  for (const word of BLOCKLIST_WORDS) {
    const regex = new RegExp(`\\b${word}\\b`, "gi");
    if (regex.test(title) || regex.test(reviewText)) {
      hasBlockedWord = true;
      // Replace with asterisks
      cleanedTitle = cleanedTitle.replace(regex, "*".repeat(word.length));
      cleanedText = cleanedText.replace(regex, "*".repeat(word.length));
    }
  }

  if (hasBlockedWord) {
    // We can either flag it for admin approval (status: "pending") or clean it.
    // Let's flag it, or let's clean it and mark as valid but pending admin review.
    return {
      isValid: true,
      cleanedTitle,
      cleanedText,
      reason: "Profanity detected and automatically filtered. Review sent for clinical moderation."
    };
  }

  return { isValid: true, cleanedTitle, cleanedText };
}
