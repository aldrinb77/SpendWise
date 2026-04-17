## 2023-10-27 - ARIA labels for icon-only buttons
**Learning:** Found several icon-only buttons (`LucidePlus`, `LucideX`, `LucideBell`, `LucideMoreHorizontal`, `LucideArrowLeft`) missing `aria-label`s, making them invisible or incomprehensible to screen readers. This is a common accessibility anti-pattern in the current UI components.
**Action:** Always verify that every `<button>` without visible text content has a descriptive `aria-label` attribute.
