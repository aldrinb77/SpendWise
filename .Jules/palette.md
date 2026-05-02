## 2026-05-02 - Contextual ARIA Labels for Repeating Actions
**Learning:** Screen reader users struggle to distinguish between identical action buttons (like 'Edit' or 'Delete') when they repeat in a table or list, even if standard ARIA labels are present.
**Action:** Always inject contextual row data (e.g., description, ID, or name) into the `aria-label` of repeating icon-only buttons so users know exactly which item the action applies to.
