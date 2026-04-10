```markdown
# Design System Specification: The Digital Atelier

## 1. Overview & Creative North Star
This design system is built upon the Creative North Star of **"The Digital Atelier."** In high fashion, an atelier is a space of craft, precision, and light. We move beyond the generic "SaaS dashboard" by treating the interface as a curated gallery. 

Instead of rigid, boxed-in layouts, we utilize **Intentional Asymmetry** and **Tonal Depth**. By overlapping large-scale editorial typography with hyper-rounded containers, we create a rhythmic flow that mimics the drape of fabric. We reject the "template" look in favor of breathing room (white space) and a sophisticated layering of translucent surfaces.

---

## 2. Color & Surface Philosophy
The palette transition from Icy Blue to Soft Cyan creates a sense of "Luminous Precision."

### The "No-Line" Rule
**Borders are a design failure in this system.** To section off content, designers must never use 1px solid lines. Instead, boundaries are defined by:
- **Background Shifts:** Placing a `surface-container-low` card on a `surface` background.
- **Tonal Transitions:** Using subtle shifts in hue to denote change in context.

### Surface Hierarchy & Nesting
Treat the UI as physical layers of fine paper or frosted glass.
- **Base Layer:** `surface` (#f8f9fa)
- **Secondary Sectioning:** `surface-container-low` (#f3f4f5)
- **Interactive Elevated Cards:** `surface-container-lowest` (#ffffff)
- **Deep Insets:** `surface-dim` (#d9dadb) for search bars or inactive states.

### The "Glass & Gradient" Rule
To inject "soul" into the SaaS framework, use **Glassmorphism** for floating elements (e.g., navigation bars or quick-action menus). Apply `surface` colors at 70% opacity with a `20px` backdrop-blur. 
*Signature Texture:* For Hero CTAs, use a linear gradient from `primary` (#0060a8) to `primary-container` (#0095ff) at a 135-degree angle.

---

## 3. Typography: Editorial Authority
We use a dual-sans pairing to balance high-fashion editorial aesthetics with functional SaaS readability.

*   **Display & Headlines (Manrope):** Chosen for its geometric precision and wide apertures. Use `display-lg` (3.5rem) with tight letter-spacing (-0.02em) to create an authoritative, "magazine-cover" feel.
*   **Body & Labels (Plus Jakarta Sans):** A modern, legible typeface that feels "airy." 
*   **The Hierarchy Role:** 
    *   **Display-sm (2.25rem):** Used for fashion category headers.
    *   **Title-md (1.125rem):** Used for product names within cards.
    *   **Label-sm (0.6875rem):** Uppercase with 0.05em tracking for metadata (e.g., "TRENDING NOW").

---

## 4. Elevation & Depth
We define hierarchy through **Tonal Layering** rather than structural geometry.

### The Layering Principle
Depth is achieved by stacking tiers. An "Outfit Recommendation" card (`surface-container-lowest`) sits atop a "Daily Forecast" section (`surface-container-low`), creating a natural lift without a single line of CSS border.

### Ambient Shadows
When an element must "float" (like a Modal or FAB), use **Ambient Shadows**:
- **Color:** A tinted version of `on-surface` (approx 6% opacity).
- **Blur:** Large (30px - 60px).
- **Spread:** -5px to keep the shadow tucked and soft.

### The "Ghost Border" Fallback
If accessibility requires a container edge, use the **Ghost Border**: `outline-variant` (#bfc7d5) at **15% opacity**. Anything higher is considered "visual noise."

---

## 5. Components

### Cards (The Hero Component)
*   **Radius:** `xl` (3rem) for main containers; `lg` (2rem) for nested items.
*   **Spacing:** Never use dividers. Use `spacing-6` (2rem) of vertical white space to separate the image from the product description.
*   **Interaction:** On hover, transition from `surface-container-lowest` to a subtle gradient fill of `primary-fixed` (#d3e4ff) at 20% opacity.

### Buttons
*   **Primary:** A pill-shaped (`full` radius) button using the `primary` (#0060a8) fill. For high-impact areas, use the Signature Gradient.
*   **Secondary:** No fill. Use a `title-sm` weight text in `primary` color. 
*   **Padding:** `1rem` (vertical) by `2.75rem` (horizontal) to ensure a premium, spacious touch target.

### Form Elements
*   **Inputs:** Abandon the four-sided box. Use a `surface-container-highest` (#e1e3e4) background with a `md` (1.5rem) radius.
*   **Focus State:** Instead of a heavy border, the background shifts to `surface-lowest` and a soft `primary` ambient shadow is applied.

### Additional Signature Component: The "Outfit Carousel"
A non-linear horizontal scroll where the center item uses `xl` (3rem) radius and active `surface-container-lowest` styling, while side items are scaled down to 90% and use `surface-dim` to pull focus to the recommendation.

---

## 6. Do’s and Don’ts

### Do:
*   **Use Asymmetry:** Offset your text headers from your card grids by one column to create a sophisticated, non-template look.
*   **Embrace the Scale:** Use the `24` (8.5rem) spacing token for major section breaks. Large gaps signal luxury.
*   **Layer with Intent:** Ensure that elements on a higher "layer" are always a lighter surface token than the layer beneath them.

### Don’t:
*   **Never use #000000 for shadows.** It kills the "Icy Blue" vibrancy. Use a deep blue-tinted grey.
*   **Avoid "Boxy" aesthetics.** If a card looks like a standard rectangle, increase the border-radius.
*   **No Dividers.** If you feel the need to add a line to separate content, increase the `spacing` token instead. Let the white space do the work.