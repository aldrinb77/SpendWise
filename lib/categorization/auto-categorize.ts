import { CATEGORY_KEYWORDS } from "./keywords";

export function autoCategorize(description: string, amount: number): { category: string, confidence: number } {
  const desc = description.toLowerCase();
  let bestCategory = "Uncategorized";
  let maxScore = 0;

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    let score = 0;
    for (const keyword of keywords) {
      if (desc.includes(keyword.toLowerCase())) {
        score += 1;
      }
    }

    if (score > maxScore) {
      maxScore = score;
      bestCategory = category;
    }
  }

  // Rule-based adjustments
  if (amount > 50000 && (desc.includes("fd") || desc.includes("deposit") || desc.includes("property"))) {
    bestCategory = "Investments";
    maxScore += 2;
  }

  if (amount < 100 && (desc.includes("chai") || desc.includes("tea") || desc.includes("coffee"))) {
    bestCategory = "Food & Dining";
    maxScore += 2;
  }

  const confidence = maxScore > 0 ? Math.min(maxScore * 40, 100) : 0;

  return {
    category: bestCategory,
    confidence: confidence,
  };
}
