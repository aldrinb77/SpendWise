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
  // @ts-ignore
  db: D1Database
): Promise<string | null> {
  const normalizedDesc = description.toLowerCase();

  // 1. Check user-specific mappings first (Learned behavior)
  try {
    const customMapping = await db
      .prepare(
        "SELECT category_id FROM merchant_mappings WHERE user_id = ? AND ? LIKE '%' || merchant_name || '%'"
      )
      .bind(userId, normalizedDesc)
      .first();

    if (customMapping) {
      return (customMapping as any).category_id;
    }
  } catch (err) {
    console.error("Error fetching merchant mappings:", err);
  }

  // 2. Check static rules
  for (const [keyword, categoryName] of Object.entries(STATIC_RULES)) {
    if (normalizedDesc.includes(keyword)) {
      // Find the category ID for this category name
      const category = await db
        .prepare("SELECT id FROM categories WHERE name = ?")
        .bind(categoryName)
        .first();
      
      if (category) {
        return (category as any).id;
      }
    }
  }

  return null;
}

export async function learnCategorization(
  merchantName: string,
  categoryId: string,
  userId: string,
  // @ts-ignore
  db: D1Database
) {
  const normalizedMerchant = merchantName.toLowerCase();
  const now = Math.floor(Date.now() / 1000);

  await db
    .prepare(
      "INSERT INTO merchant_mappings (id, user_id, merchant_name, category_id, times_used, created_at, updated_at) " +
      "VALUES (?, ?, ?, ?, 1, ?, ?) " +
      "ON CONFLICT(user_id, merchant_name) DO UPDATE SET " +
      "category_id = excluded.category_id, " +
      "times_used = merchant_mappings.times_used + 1, " +
      "updated_at = excluded.updated_at"
    )
    .bind(crypto.randomUUID(), userId, normalizedMerchant, categoryId, now, now)
    .run();
}
