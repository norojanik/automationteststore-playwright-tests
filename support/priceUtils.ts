export function priceTextToNumber(text: string): number {
    const match = text.replace(/,/g, "").match(/[\d]+(\.\d+)?/);
    if (!match) {
      throw new Error(`Could not parse a price out of: "${text}"`);
    }
    return Number(match[0]);
  }
  
  export function roundToCents(value: number): number {
    return Math.round(value * 100) / 100;
  }
  