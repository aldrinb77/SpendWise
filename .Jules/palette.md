## 2024-05-14 - Accessibility for Row Actions
**Learning:** Icon-only action buttons in data tables require contextual row data in their ARIA labels (e.g., "Edit vendor name") so screen reader users can distinguish actions between different rows. Standard hover states and decorative hiding of inner SVG elements enhances the experience.
**Action:** Always inject specific row identifiers like descriptions or titles into `aria-label` and `title` attributes for repetitive icon buttons, and remember to use `aria-hidden="true"` on the SVG itself.
