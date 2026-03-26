import { Product, Answer, AssessmentMode } from "./types";
import { CriterionAnswer } from "./r-strategy/types";

/**
 * Encode product data into a compact base64 string for URL sharing
 * Supports both HBR and R-strategy assessment modes
 */
export function encodeProductForURL(product: Product): string {
  const mode = product.assessmentMode || 'hbr';
  
  let data: Record<string, unknown>;
  
  if (mode === 'r-strategy' && product.rStrategyAnswers) {
    // R-strategy encoding
    data = {
      n: product.name,
      m: mode,
      r: product.rStrategyAnswers.map((ans) => `${ans.criterionId}:${ans.value}`).join(","),
    };
  } else {
    // HBR encoding (default for backward compatibility)
    data = {
      n: product.name,
      m: mode,
      a: product.answers?.map((ans) => `${ans.questionId}:${ans.value}`).join(","),
    };
  }
  
  const json = JSON.stringify(data);
  // Use base64url encoding (URL-safe)
  return btoa(json).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/**
 * Decode product data from a base64 URL string
 * Supports both HBR and R-strategy assessment modes
 */
export function decodeProductFromURL(encoded: string): { 
  name: string; 
  assessmentMode: AssessmentMode;
  answers?: Answer[];
  rStrategyAnswers?: CriterionAnswer[];
} | null {
  try {
    // Restore base64 padding and convert from base64url
    const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const padding = 4 - (base64.length % 4);
    const padded = padding !== 4 ? base64 + "=".repeat(padding) : base64;
    
    const json = atob(padded);
    const data = JSON.parse(json);
    
    const mode: AssessmentMode = data.m || 'hbr';
    
    if (mode === 'r-strategy' && data.r) {
      // Parse R-strategy answers
      const rStrategyAnswers: CriterionAnswer[] = data.r.split(",").map((s: string) => {
        const [criterionId, value] = s.split(":");
        return { 
          criterionId, 
          value: parseInt(value, 10),
          normalizedScore: parseInt(value, 10) * 20, // Rough conversion
        };
      });
      
      return {
        name: data.n,
        assessmentMode: mode,
        rStrategyAnswers,
      };
    } else {
      // Parse HBR answers (default for backward compatibility)
      const answers: Answer[] = data.a ? data.a.split(",").map((s: string) => {
        const [questionId, value] = s.split(":");
        return { questionId, value: parseInt(value, 10) };
      }) : [];
      
      return {
        name: data.n,
        assessmentMode: mode,
        answers,
      };
    }
  } catch {
    return null;
  }
}

/**
 * Generate a shareable URL for a product
 */
export function generateShareURL(product: Product): string {
  if (typeof window === "undefined") return "";
  
  const encoded = encodeProductForURL(product);
  const url = new URL(window.location.origin + "/assess");
  url.searchParams.set("share", encoded);
  return url.toString();
}

/**
 * Copy share URL to clipboard
 */
export async function copyShareURL(product: Product): Promise<boolean> {
  try {
    const url = generateShareURL(product);
    await navigator.clipboard.writeText(url);
    return true;
  } catch {
    return false;
  }
}
