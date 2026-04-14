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
  
  // Very robust pattern matching for generic Indian bank statements
  // Many use: DD MMM YYYY  |  Description  |  -₹123.00
  // Or: DD/MM/YYYY  |  Description  |  123.45  | 1234.56
  
  const lines = text.split('\n');
  
  for (const line of lines) {
    // 1. Date check (Multiple formats: 14 Oct 2023, 14-Oct-2023, 14/10/2023, 14/10/23)
    const dateMatch = line.match(/(\d{1,2}(?:\s+|\/|-)[A-Za-z]{3,9}(?:\s+|\/|-)\d{2,4})|(\d{1,2}\/\d{2}\/\d{2,4})/);
    if (!dateMatch) continue;

    const dateStr = dateMatch[0];
    
    // 2. Amount and Type check
    // Handle symbols like ₹, Rs, RS., etc.
    // Handle negatives/positives or Debit/Credit columns
    const amountMatch = line.match(/(?:[-+₹Rs.\s])*([\d,]+\.\d{2})/);
    if (!amountMatch) continue;

    const amountStr = amountMatch[1].replace(/,/g, '');
    const amount = parseFloat(amountStr);
    
    // Determine type (if it contains 'Paid to', 'To', '-', it's an expense)
    const normalizedLine = line.toLowerCase();
    const isExpense = normalizedLine.includes('paid to') || 
                      normalizedLine.includes('to ') || 
                      line.includes('-') || 
                      normalizedLine.includes('dr');
    
    const description = line
      .replace(dateStr, '')
      .replace(amountMatch[0], '')
      .trim()
      .substring(0, 50); // Keep it clean

    if (amount > 0) {
      txns.push({
        date: new Date(dateStr).toISOString(),
        description: description || "Bank Transaction",
        amount,
        type: isExpense ? "expense" : "income"
      });
    }
  }

  return txns;
}
