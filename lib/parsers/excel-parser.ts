import * as XLSX from 'xlsx';

export async function parseExcel(file: File): Promise<any[]> {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(sheet);

  const transactions: any[] = [];

  for (const row of data as any[]) {
    // Attempt to extract values
    const dateStr = row['Date'] || row['date'] || '';
    if (!dateStr) continue;

    // Parse date
    let dateObj = new Date();
    if (typeof dateStr === 'string' && dateStr.includes('/')) {
        const [dd, mm, yyyy] = dateStr.split('/');
        dateObj = new Date(`${yyyy}-${mm}-${dd}T12:00:00Z`);
    } else if (typeof dateStr === 'number') {
        // Excel serial date
        dateObj = new Date((dateStr - 25569) * 86400 * 1000);
    }
    
    // Validate date
    if (isNaN(dateObj.getTime())) continue;

    const credit = parseFloat(row['Credit'] || row['credit'] || '0');
    const debit = parseFloat(row['Debit'] || row['debit'] || '0');
    
    if (credit === 0 && debit === 0) continue;

    const amount = credit > 0 ? credit : debit;
    const type = credit > 0 ? 'income' : 'expense';

    const entity = row['From/To'] || row['from/to'] || row['Entity'] || row['entity'] || 'Unknown Entity';
    const notes = row['Notes'] || row['notes'] || '';
    
    const description = notes ? `${entity} - ${notes}` : entity;

    // Basic auto-categorization
    let category = "Other";
    const descLower = description.toLowerCase();
    
    if (descLower.includes('salary') || type === 'income') category = 'Income';
    else if (descLower.includes('food') || descLower.includes('zomato') || descLower.includes('swiggy') || descLower.includes('cafe') || descLower.includes('drink')) category = 'Food & Dining';
    else if (descLower.includes('repayment') || descLower.includes('debt') || descLower.includes('loan')) category = 'Bills & Utilities';
    else if (descLower.includes('petrol') || descLower.includes('uber') || descLower.includes('ola')) category = 'Transportation';
    else if (descLower.includes('ps5') || descLower.includes('game') || descLower.includes('movie') || descLower.includes('drinks') || descLower.includes('saloon')) category = 'Entertainment';

    transactions.push({
      date: dateObj.toISOString(),
      amount: amount,
      type: type,
      description: description,
      category_id: category, // Using category_id field to store category_name temporarily for UI mapper
      notes: notes
    });
  }

  return transactions;
}
