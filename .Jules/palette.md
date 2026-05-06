## 2024-05-18 - Accessibility Improvement on Icon-only Elements
**Learning:** Found a pattern of missing `aria-label` attributes on purely icon-based actions (Edit, Delete, Close, Clear) which screen readers cannot interpret correctly. Also found missing `aria-hidden` attributes on the SVG inner icons which creates redundant and confusing announcements for screen readers.
**Action:** Always verify icon-only buttons have descriptive `aria-label`s, and make sure inner decorative SVG icons contain `aria-hidden="true"`.
