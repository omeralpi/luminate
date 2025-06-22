import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Truncates a wallet address for display purposes
 * @param address - The full wallet address
 * @param startLength - Number of characters to show at the start (default: 6)
 * @param endLength - Number of characters to show at the end (default: 4)
 * @returns Truncated wallet address (e.g., "GABCDE...WXYZ")
 */
export function truncateWalletAddress(
  address: string,
  startLength: number = 6,
  endLength: number = 4
): string {
  if (!address || address.length <= startLength + endLength) {
    return address;
  }

  const start = address.slice(0, startLength);
  const end = address.slice(-endLength);

  return `${start}...${end}`;
}

export function stripHtml(html: string): string {
  let text = html.replace(/<\/?[^>]+(>|$)/g, "");

  text = text.replace(/&nbsp;/g, " ");
  text = text.replace(/&amp;/g, "&");
  text = text.replace(/&lt;/g, "<");
  text = text.replace(/&gt;/g, ">");
  text = text.replace(/&quot;/g, '"');
  text = text.replace(/&#39;/g, "'");

  text = text.replace(/\s+/g, " ").trim();

  return text;
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function getRelativeTime(date: Date | string) {
  const now = new Date();
  const then = new Date(date);
  const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);

  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  const years = Math.floor(months / 12);
  return `${years}y ago`;
}

type LexicalNode = {
  type?: string;
  text?: string;
  children?: LexicalNode[];
};

export function lexicalToText(lexicalJson: string): string {
  try {
    if (!lexicalJson || !lexicalJson.trim().startsWith('{"root":')) {
      return lexicalJson;
    }

    const data: { root: LexicalNode } = JSON.parse(lexicalJson);
    let text = '';

    const traverse = (node: LexicalNode) => {
      if (node.type === 'text' && node.text) {
        text += node.text + ' ';
      }

      if (node.children) {
        for (const child of node.children) {
          traverse(child);
        }
      }
    };

    if (data.root) {
      traverse(data.root);
    }

    return text.trim();
  } catch {
    return lexicalJson;
  }
}

export const calculateReadingTime = (text: string) => {
  const wordsPerMinute = 100;

  const textFromLexical = lexicalToText(text);
  const cleanText = stripHtml(textFromLexical);

  const words = cleanText.trim().split(/\s+/).filter(Boolean).length;

  const minutes = Math.ceil(words / wordsPerMinute);

  return {
    minutes,
    words,
    text: minutes <= 1 ? '1 min read' : `${minutes} min read`
  };
};