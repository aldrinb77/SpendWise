## 2024-04-21 - Contextual ARIA labels for repeating table actions
**Learning:** Icon-only buttons (like Edit/Delete) inside repeating lists or tables create a terrible screen reader experience if they just say "Edit" 50 times. Screen reader users lose the context of which row they are on.
**Action:** Always inject contextual row data into the ARIA labels for repeating elements (e.g., `aria-label={"Edit transaction: " + t.description}`). Also adding `title` helps sighted keyboard users.
