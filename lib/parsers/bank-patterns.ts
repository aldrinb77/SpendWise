export interface ExtractedTransaction {
  date: Date;
  description: string;
  amount: number;
  type: "income" | "expense";
  originalRow?: string;
}

export const BANK_PATTERNS = {
  PAYTM: {
    // pattern: 14 Oct 2023 10:20 AM  Paid to Swiggy  - ₹250.00
    // Simplified for robustness
    rowRegex: /(\d{1,2}\s+[A-Za-z]{3}\s+\d{4}).*?(Paid to|From|Added to Wallet).*?(?:(-|))₹([\d,.]+)/g,
    dateMap: (match: string) => new Date(match),
  },
  HDFC: {
    // pattern: 14/10/23  UPI-SWIGGY-1234  14/10/23  250.00  0.00
    rowRegex: /(\d{2}\/\d{2}\/\d{2,4})\s+(.*?)\s+(\d{2}\/\d{2}\/\d{2,4})\s+([\d,.]+)\s+([\d,.]+)/g,
  },
  SBI: {
     // pattern: 14-Oct-2023  UPI/CR/3282.../SWIGGY   250.00   0.00
     rowRegex: /(\d{2}-[A-Za-z]{3}-\d{4})\s+(.*?)\s+([\d,.]+)\s+([\d,.]+)/g,
  }
};

export function parsePaytmText(text: string): ExtractedTransaction[] {
  const txns: ExtractedTransaction[] = [];
  // This is a simplified regex-based parser
  // Real statements are often tabular, so we look for patterns in lines
  const lines = text.split('\n');
  
  for (const line of lines) {
    // Paytm UPI pattern
    // Usually: dd MMM yyyy hh:mm am/pm | Description | -/+ Amount
    const match = line.match(/(\d{1,2}\s+[A-Za-z]{3}\s+\d{4}).*?([+-])\s*[₹Rs.]?\s*([\d,.]+)/);
    if (match) {
      const dateStr = match[1];
      const sign = match[2];
      const amount = parseFloat(match[3].replace(/,/g, ''));
      const description = line.replace(match[0], '').trim();

      txns.push({
        date: new Date(dateStr),
        description: description || "Paytm Transaction",
        amount,
        type: sign === '-' ? 'expense' : 'income'
      });
    }
  }

  return txns;
}
