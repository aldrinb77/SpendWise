## 2026-05-08 - Contextual ARIA labels in repeating rows
**Learning:** When using icon-only buttons in repeating rows (like data tables), screen readers announce the exact same label for every row (e.g., 'Edit transaction'). This makes it impossible for users to know which row they are acting upon when navigating by interactive elements.
**Action:** Always inject contextual row data (like the item's description or ID) into the aria-label (e.g., 'Edit transaction Apple Store') to ensure each action is distinguishable.
