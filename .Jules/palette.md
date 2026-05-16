## 2024-05-24 - Accessibility improvements for icon buttons
**Learning:** Found several icon-only buttons in the transaction table and form that lack ARIA labels, making them inaccessible to screen readers.
**Action:** Added `aria-label` to these buttons with clear descriptions of their actions, and set `aria-hidden="true"` on their inner SVG icons to avoid redundant screen reader announcements.
