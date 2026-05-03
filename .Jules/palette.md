## 2024-05-18 - Contextual ARIA labels in data tables
**Learning:** Adding static `aria-label`s (e.g., "Edit" or "Delete") to repeating icon-only buttons in data tables or lists is insufficient for screen reader users, as they cannot distinguish which row the action applies to when tabbing through the table or using an elements list.
**Action:** Always inject contextual row data (like a description or ID) into the `aria-label` (e.g., `aria-label={"Edit transaction " + row.description}`) for repeating elements to ensure unique, meaningful announcements.
