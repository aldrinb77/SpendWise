## 2024-05-24 - Accessibility improvements for icon-only buttons
**Learning:** Found multiple icon-only buttons across the app lacking proper screen reader announcements and keyboard navigation indicators (e.g., `mobile-nav.tsx`, `file-upload.tsx`).
**Action:** Always add descriptive `aria-label`s to `button`s containing only icons, and ensure `focus-visible` utility classes are applied for clear keyboard focus states.
