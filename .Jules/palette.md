## 2026-04-26 - Contextual ARIA Labels in Repeating Elements
**Learning:** When adding ARIA labels to icon-only buttons in repeating elements (like a mapped table or list), a generic label like 'Delete' causes accessibility issues because screen reader users cannot distinguish between them.
**Action:** Always inject contextual row data (like `t.description` or `t.id`) into the ARIA label (e.g., `aria-label={\`Delete ${t.description} transaction\`}`) to ensure unique and descriptive labels for each interactive element.
