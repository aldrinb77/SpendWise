export interface ParsedTransaction {
  date: string; // ISO string
  description: string;
  amount: number;
  type: "income" | "expense";
  category_id?: string;
}

export async function parseBankPDF(file: File): Promise<ParsedTransaction[]> {
  const pdfjs = await import('pdfjs-dist');
  pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
  let fullText = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map((item: any) => item.str).join(' ');
    fullText += pageText + '\n';
  }

  // Use the patterns we defined
  return extractInfo(fullText);
}

function extractInfo(text: string): ParsedTransaction[] {
  const txns: ParsedTransaction[] = [];
  
  // High-precision Indian Merchant Dictionary
  const merchantCategories: Record<string, string[]> = {
    "Food & Dining": ["swiggy", "zomato", "eatclub", "domino", "mcdonald", "kfc", "starbucks", "restaura", "pizza", "burger", "cafe", "food", "dairy", "bakery"],
    "Shopping": ["amazon", "flipkart", "myntra", "ajio", "nykaa", "meesho", "blinkit", "zepto", "bigbasket", "instamart", "reliance", "dmart", "store", "supermarket"],
    "Transportation": ["uber", "ola", "rapido", "metro", "irctc", "petrol", "filling", "shell", "hpcl", "bpcl", "indianoil", "auto", "travel"],
    "Bills & Utilities": ["jio", "airtel", "vi ", "recharge", "electricity", "water", "bescom", "gas", "insurance", "lic"],
    "Entertainment": ["netflix", "prime video", "hotstar", "spotify", "pvr", "inox", "bookmyshow", "steam", "play"],
    "Healthcare": ["apollo", "pharmacy", "medplus", "1mg", "hospital", "doctor", "lab", "clinic"]
  };

  const getCategory = (desc: string) => {
    let cat = "Other";
    const lowerDesc = desc.toLowerCase();
    for (const [category, keywords] of Object.entries(merchantCategories)) {
      if (keywords.some(k => lowerDesc.includes(k))) {
        cat = category;
        break;
      }
    }
    if (lowerDesc.includes("salary") || lowerDesc.includes("dividend") || lowerDesc.includes("interest")) {
      cat = "Income";
    }
    return cat;
  };

  // Modern Paytm PDF Parsing (splits by Date pattern which is usually glued together on one line)
  const paytmParts = text.split(/(?=\d{2}\s+[A-Z][a-z]{2}\s+\d{1,2}:\d{2}\s+[AP]M)/);
  
  // Paytm usually lists in reverse chronological order (Newest first).
  // But they omit the year on individual transactions!
  // E.g. 15 Jan, 02 Jan, 31 Dec, 25 Dec...
  // When we go from Jan (Month 0) to Dec (Month 11) while reading top-to-bottom, we crossed a year boundary backward!
  let currentEstimatedYear = new Date().getFullYear();
  let lastSeenMonth = -1;

  for (const part of paytmParts) {
    const trimmed = part.trim();
    if (!trimmed) continue;

    // e.g. "25 Dec 12:15 AM Paid to Hans Filling Station... - Rs.300"
    const dateMatch = trimmed.match(/^(\d{2}\s+[A-Z][a-z]{2}\s+\d{1,2}:\d{2}\s+[AP]M)/);
    if (!dateMatch) continue;

    const dateStr = dateMatch[1];
    
    // Amount usually at the end e.g. "- Rs.300", "+ Rs.1,000", "+ Rs.116", "- Rs.30"
    const amountMatch = trimmed.match(/([-+])\s*(?:Rs\.?|INR|₹)\s*([\d,]+(?:\.\d{2})?)/i);
    if (!amountMatch) continue;

    const sign = amountMatch[1];
    const amountStr = amountMatch[2].replace(/,/g, '');
    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount === 0) continue;

    let type: "income" | "expense" = sign === '+' ? 'income' : 'expense';

    // Extract Description (Strip Date and UPI metadata)
    let desc = trimmed
      .replace(dateStr, '')
      .split(/UPI ID:|UPI Ref No:|Order ID:|Tag:/i)[0]
      .replace(/Paid to/ig, '')
      .replace(/Received from/ig, '')
      .replace(/Money sent to/ig, '')
      .replace(/Gift Card - /ig, '')
      .trim();

    // Smart Year Tracking
    const tempDate = new Date(`${dateStr} 2000`); // Dummy year to safely extract month
    const currentMonth = tempDate.getMonth();
    
    // If the month jumps up significantly (e.g. 0 to 11), we transitioned backward over a year line
    if (lastSeenMonth !== -1 && currentMonth > lastSeenMonth + 1) {
       currentEstimatedYear--;
    }
    lastSeenMonth = currentMonth;

    txns.push({
      date: new Date(`${dateStr} ${currentEstimatedYear}`).toISOString(),
      description: desc || "Transaction",
      amount,
      type,
      category_id: getCategory(desc)
    });
  }

  // Fallback for standard line-by-line PDFs (HDFC/ICICI style)
  if (txns.length < 5) {
    const lines = text.split('\n');
    for (const line of lines) {
      if (paytmParts.some(p => p.includes(line))) continue; // Skip if already parsed

      const dateMatch = line.match(/(\d{1,2}\/\d{1,2}\/\d{2,4})|(\d{1,2}-[A-Za-z]{3}-\d{2,4})/);
      if (!dateMatch) continue;

      const dateStr = dateMatch[0];
      const amountMatch = line.match(/(?:Rs\.?|INR|₹)?\s*([\d,]+\.\d{2})\s*(CR|DR|\+|-)?/i);
      if (!amountMatch) continue;

      const amountStr = amountMatch[1].replace(/,/g, '');
      const amount = parseFloat(amountStr);
      if (isNaN(amount) || amount === 0) continue;

      let desc = line.replace(dateStr, '').replace(/[\d]{10,}/g, '').replace(/\s+/g, ' ').trim();
      let type: "income" | "expense" = line.includes('CR') || line.includes('+') ? 'income' : 'expense';

      txns.push({
        date: new Date(dateStr).toISOString(),
        description: desc || "Transaction",
        amount,
        type,
        category_id: getCategory(desc)
      });
    }
  }

  return txns;
}
