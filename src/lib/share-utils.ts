import { Product, Answer } from "./types";

/**
 * Encode product data into a compact base64 string for URL sharing
 */
export function encodeProductForURL(product: Product): string {
  const data = {
    n: product.name,
    a: product.answers.map((ans) => `${ans.questionId}:${ans.value}`).join(","),
  };
  const json = JSON.stringify(data);
  // Use base64url encoding (URL-safe)
  return btoa(json).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/**
 * Decode product data from a base64 URL string
 */
export function decodeProductFromURL(encoded: string): { name: string; answers: Answer[] } | null {
  try {
    // Restore base64 padding and convert from base64url
    const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const padding = 4 - (base64.length % 4);
    const padded = padding !== 4 ? base64 + "=".repeat(padding) : base64;
    
    const json = atob(padded);
    const data = JSON.parse(json);
    
    // Parse answers from compressed format
    const answers: Answer[] = data.a.split(",").map((s: string) => {
      const [questionId, value] = s.split(":");
      return { questionId, value: parseInt(value, 10) };
    });
    
    return {
      name: data.n,
      answers,
    };
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
