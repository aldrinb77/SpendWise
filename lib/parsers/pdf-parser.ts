export interface ParsedTransaction {
  date: string; // ISO string
  description: string;
  amount: number;
  type: "income" | "expense";
  category_id?: string;
}

export async function parseBankPDF(file: File): Promise<ParsedTransaction[]> {
  const pdfjs = await import('pdfjs-dist');
  pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

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
  const lines = text.split('\n');
  
  // High-precision Indian Merchant Dictionary
  const merchantCategories: Record<string, string[]> = {
    "Food & Dining": ["swiggy", "zomato", "eatclub", "domino", "mcdonald", "kfc", "starbucks", "restaura", "pizza", "burger", "cafe"],
    "Shopping": ["amazon", "flipkart", "myntra", "ajio", "nykaa", "meesho", "blinkit", "zepto", "bigbasket", "instamart", "reliance", "dmart"],
    "Transportation": ["uber", "ola", "rapido", "metro", "irctc", "petrol", "filling", "shell", "hpcl", "bpcl", "indianoil"],
    "Bills & Utilities": ["jio", "airtel", "vi ", "recharge", "electricity", "water", "bescom", "gas", "insurance", "lic"],
    "Entertainment": ["netflix", "prime video", "hotstar", "spotify", "pvr", "inox", "bookmyshow", "steam"],
    "Healthcare": ["apollo", "pharmacy", "medplus", "1mg", "hospital", "doctor", "lab"]
  };

  for (const line of lines) {
    // 1. Paytm/UPI Date Pattern: 14 Oct 2023 or 14/10/2023
    const dateMatch = line.match(/(\d{1,2}\s+[A-Za-z]{3}\s+\d{4})|(\d{1,2}\/\d{1,2}\/\d{2,4})|(\d{1,2}-[A-Za-z]{3}-\d{2,4})/);
    if (!dateMatch) continue;

    const dateStr = dateMatch[0];
    
    // 2. Amount Pattern: Match numbers like 1,234.56 or 123.00
    // Paytm often has amounts like " - 123.00" or " + 500.00"
    const amountMatch = line.match(/(?:[-+₹Rs.\s])*([\d,]+\.\d{2})/);
    if (!amountMatch) continue;

    const amountStr = amountMatch[1].replace(/,/g, '');
    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount === 0) continue;

    // 3. Smart Description Extraction
    let description = line
      .replace(dateStr, '')
      .replace(/[\d]{10,}/g, '') // Remove long UPI ref numbers
      .replace(/\s+/g, ' ')
      .trim();

    // Clean up common Paytm prefixes
    description = description
      .replace(/Paid to\s+/i, '')
      .replace(/Received from\s+/i, '')
      .replace(/Transfer to\s+/i, '')
      .split(/SUCCESSFUL|FAILED|PENDING/i)[0] // Remove status
      .trim();

    const normalizedDesc = description.toLowerCase();
    
    // 4. Advanced Categorization
    let selectedCategory = "Other";
    let type: "income" | "expense" = normalizedDesc.includes('received') || line.includes('+') ? "income" : "expense";

    // Detect type from context if unsure (Paytm specific)
    if (line.includes('-') || normalizedDesc.includes('paid to')) {
      type = "expense";
    }

    for (const [category, keywords] of Object.entries(merchantCategories)) {
      if (keywords.some(k => normalizedDesc.includes(k))) {
        selectedCategory = category;
        break;
      }
    }

    // Special case for Salary/Direct Income
    if (normalizedDesc.includes("salary") || normalizedDesc.includes("dividend") || normalizedDesc.includes("interest")) {
      selectedCategory = "Income";
      type = "income";
    }

    txns.push({
      date: new Date(dateStr).toISOString(),
      description: description || "Transaction",
      amount,
      type,
      category_id: selectedCategory // Will be mapped to UUID on server
    });
  }

  return txns;
}
