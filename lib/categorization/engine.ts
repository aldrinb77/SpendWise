import { Category } from "@/lib/db/types";

// Static rules for known Indian merchants
const STATIC_RULES: Record<string, string> = {
  swiggy: "Food & Dining",
  zomato: "Food & Dining",
  uber: "Transportation",
  ola: "Transportation",
  rapido: "Transportation",
  amazon: "Shopping",
  flipkart: "Shopping",
  myntra: "Shopping",
  nykaa: "Shopping",
  netflix: "Entertainment",
  spotify: "Entertainment",
  prime: "Entertainment",
  hotstar: "Entertainment",
  jio: "Bills & Utilities",
  airtel: "Bills & Utilities",
  vi: "Bills & Utilities",
  bescom: "Bills & Utilities",
  recharge: "Bills & Utilities",
  pharmacy: "Healthcare",
  hospital: "Healthcare",
  apollo: "Healthcare",
  petrol: "Transportation",
  fuel: "Transportation",
  metro: "Transportation",
  irctc: "Transportation",
  pvr: "Entertainment",
  inox: "Entertainment",
  bookmyshow: "Entertainment",
  salary: "Income",
  interest: "Income",
  divident: "Income",
  cashback: "Income",
  transfer: "Transfer",
  neft: "Transfer",
  imps: "Transfer",
  upi: "Transfer",
};

export async function autoCategorize(
  description: string,
  userId: string,
  supabase: any
): Promise<string | null> {
  const normalizedDesc = description.toLowerCase();

  // 1. Check user-specific mappings first (Learned behavior)
  try {
    const { data: customMapping, error } = await supabase
      .from('merchant_mappings')
      .select('category_id')
      .eq('user_id', userId)
      .ilike('merchant_name', `%${normalizedDesc}%`)
      .limit(1)
      .single();

    if (customMapping && !error) {
      return customMapping.category_id;
    }
  } catch (err) {
    console.error("Error fetching merchant mappings:", err);
  }

  // 2. Check static rules
  for (const [keyword, categoryName] of Object.entries(STATIC_RULES)) {
    if (normalizedDesc.includes(keyword)) {
      // Find the category ID for this category name
      const { data: category } = await supabase
        .from('categories')
        .select('id')
        .eq('name', categoryName)
        .single();
      
      if (category) {
        return category.id;
      }
    }
  }

  return null;
}

export async function learnCategorization(
  merchantName: string,
  categoryId: string,
  userId: string,
  supabase: any
) {
  const normalizedMerchant = merchantName.toLowerCase();
  
  // Upsert the merchant mapped category
  await supabase
    .from('merchant_mappings')
    .upsert(
      { 
        user_id: userId, 
        merchant_name: normalizedMerchant, 
        category_id: categoryId,
        updated_at: new Date().toISOString()
      },
      { onConflict: 'user_id, merchant_name' }
    );
}
