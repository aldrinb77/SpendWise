## 2025-05-18 - Contextual ARIA labels in repeating elements
**Learning:** When adding ARIA labels to icon-only buttons in repeating elements (like tables or lists), it is crucial to inject contextual row data (e.g., description or ID) into the label. Otherwise, screen reader users will just hear "Edit button" or "Delete button" repeatedly without knowing *which* item they are modifying.
**Action:** Always inject contextual information like item descriptions or IDs into `aria-label`s for actions in lists or tables, so users can distinguish between them.
