## 2025-05-18 - Icon-only buttons lacking ARIA context in mapped rows
**Learning:** Adding static `aria-label` to icon-only buttons in mapped rows like transaction tables creates ambiguity for screen reader users, as all buttons read exactly the same (e.g. "Delete transaction"). Screen reader users cannot tell which item they are about to edit or delete without more context.
**Action:** Always inject contextual row data (like the transaction's description or ID) into the `aria-label` and native `title` of mapped icon-only buttons to distinguish them from each other.
