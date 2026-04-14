export const DEFAULT_CATEGORIES = [
  { name: "Food & Dining", icon: "Utensils", color: "#F87171" }, // Red 400
  { name: "Shopping", icon: "ShoppingBag", color: "#F472B6" }, // Pink 400
  { name: "Transportation", icon: "Car", color: "#60A5FA" }, // Blue 400
  { name: "Bills & Utilities", icon: "Zap", color: "#FBBF24" }, // Amber 400
  { name: "Entertainment", icon: "Play", color: "#A78BFA" }, // Purple 400
  { name: "Healthcare", icon: "Stethoscope", color: "#34D399" }, // Emerald 400
  { name: "Education", icon: "BookOpen", color: "#4ADE80" }, // Green 400
  { name: "Investments", icon: "TrendingUp", color: "#818CF8" }, // Indigo 400
  { name: "Income", icon: "PlusCircle", color: "#10B981" }, // Green 500
  { name: "Transfer", icon: "ArrowRightLeft", color: "#94A3B8" }, // Slate 400
  { name: "Other", icon: "CircleEllipsis", color: "#D1D5DB" }, // Gray 300
];

export async function seedCategories(
  // @ts-ignore
  db: D1Database
) {
  const { count } = await db.prepare("SELECT count(*) as count FROM categories").first() as any;
  
  if (count > 0) return;

  const statements = DEFAULT_CATEGORIES.map((cat) => {
    return db
      .prepare(
        "INSERT INTO categories (id, name, icon, color, is_default) VALUES (?, ?, ?, ?, 1)"
      )
      .bind(crypto.randomUUID(), cat.name, cat.icon, cat.color);
  });

  await db.batch(statements);
}
