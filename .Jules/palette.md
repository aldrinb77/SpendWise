## 2024-05-22 - [Accessible Transaction Table Actions]
**Learning:** The project's repeating list elements (like transactions) were lacking contextual ARIA labels on action icons, causing screen reader ambiguity (e.g., 'Delete' instead of 'Delete Starbucks Coffee'). They also lacked visible focus states for keyboard navigation.
**Action:** Applied contextual aria-labels using row data `{t.description}` and the standard `focus-visible:ring-2` tailwind classes for keyboard users.
