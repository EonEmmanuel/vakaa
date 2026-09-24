# VAKAA VISUAL FIDELITY SPECIFICATION V2
## Canonical Homepage Driven Frontend Reconstruction

### PURPOSE

This document supersedes all previous frontend design instructions.

The approved Vakaa homepage screenshot is now the canonical visual specification.

The objective is not to create a new design.

The objective is to reproduce the approved visual language with extremely high fidelity and extend it consistently across the entire platform.

Target fidelity:

95%+ visual similarity.

---

# NON-NEGOTIABLE RULES

## DO NOT

- Invent new layouts.
- Invent new typography systems.
- Invent new spacing systems.
- Introduce new card styles.
- Introduce new color palettes.
- Use generic ecommerce templates.
- Use shadcn examples as final UI.
- Use Tailwind defaults as visual decisions.
- Redesign the homepage.

## DO

- Reverse engineer the approved homepage.
- Create reusable components from it.
- Build every future page from those components.
- Maintain visual consistency everywhere.

---

# HOMEPAGE BREAKDOWN

## SECTION 01 — HEADER

### Structure

Three-zone layout.

LEFT:
- Navigation links

CENTER:
- Vakaa logo

RIGHT:
- Search
- Account
- Cart

### Requirements

Logo remains visually centered.

Navigation remains lightweight.

Large horizontal spacing.

Luxury minimalism.

No sticky colored bars.

No oversized navigation.

No ecommerce template header.

### Visual Character

Elegant.

Light.

Premium.

Fashion-first.

Not marketplace-first.

---

# SECTION 02 — HERO

### Layout Ratio

Approximately:

40% content

60% visual

### Left Side

Headline:

CARRYING AFRICA.
EVERYWHERE.

Very large.

Luxury serif.

Strong hierarchy.

Supporting copy underneath.

Two CTA actions.

### Right Side

Large luxury image.

Product must be visible.

Lifestyle photography.

Premium composition.

### Background

Soft luxury layered shapes.

Subtle geometric curves.

Depth without noise.

Do not use:
- Flat backgrounds
- Generic gradients
- Startup hero patterns

---

# SECTION 03 — TRUST BAR

Immediately below hero.

Contains:

- Artisan message
- Material quality
- Secure payment
- Worldwide delivery

### Requirements

Single horizontal row.

Light background.

Minimal icons.

Luxury spacing.

Not promotional banner styling.

---

# SECTION 04 — COLLECTIONS

### Layout

Section title left.

View all link right.

Five collection cards.

### Card Rules

Consistent image ratio.

Large image.

Minimal text.

Soft shadows.

Light background.

Premium hover state.

### Future Usage

This becomes the master collection component.

Reuse everywhere.

---

# SECTION 05 — BRAND STORY

Two-column editorial layout.

LEFT

Typography.

Story content.

CTA.

RIGHT

Large lifestyle image.

### Requirements

Magazine-style composition.

Large whitespace.

Luxury storytelling.

---

# SECTION 06 — BEST SELLERS

Master product grid.

This component becomes:

- Shop page cards
- Search results cards
- Wishlist cards
- Recommendations cards
- Related products cards

### Product Card Specification

Image first.

Name.

Price.

Rating.

Wishlist icon.

No alternative card designs allowed.

---

# SECTION 07 — EMAIL CAPTURE

Luxury minimal signup.

Not marketing-heavy.

Not popup-style.

Integrated naturally.

---

# SECTION 08 — FOOTER

Dark luxury footer.

Gold accents.

Premium spacing.

Structured navigation.

Brand statement.

Social links.

This becomes the global footer.

---

# DESIGN TOKENS

## COLORS

Background:
#F8F4EE

Surface:
#EFE8DD

Primary Text:
#1D120A

Secondary Text:
#3A2418

Gold:
#D4A43C

Bronze:
#A66B2D

Border:
#E7DED0

Never use pure black.

---

# TYPOGRAPHY

## Hero

Luxury editorial serif.

Very large.

High contrast.

## Section Titles

Elegant serif.

## Body

Modern sans-serif.

Readable.

Premium spacing.

---

# SPACING

Luxury spacing.

Large gutters.

Large section separation.

Large margins.

Every page must breathe.

---

# PAGE ADAPTATION RULE

Before designing any page ask:

How would this page look if it were designed by the same designer who created the approved homepage?

Then reuse existing patterns.

Never invent new ones.

---

# PAGE-BY-PAGE INHERITANCE

## SHOP PAGE

Reuse:

- Header
- Footer
- Collection cards
- Product cards

Add:

- Filters
- Sorting

Nothing else changes.

---

## PRODUCT PAGE

Reuse homepage typography.

Reuse homepage spacing.

Reuse homepage color system.

Create:

- Gallery
- Product info
- Story section
- Artisan section
- Related products

Must feel like homepage.

---

## CART

Must feel editorial.

Not transactional.

Large product rows.

Premium summary panel.

Luxury CTAs.

---

## CHECKOUT

Luxury form experience.

Warm palette.

Large spacing.

Elegant progress stepper.

Premium order summary.

No generic checkout templates.

---

## ACCOUNT AREA

Must feel like Vakaa.

Not SaaS.

Not dashboard software.

Use:

- Same cards
- Same typography
- Same colors
- Same spacing

---

# MOBILE SPECIFICATION

Do not redesign.

Adapt.

Homepage must still feel identical.

Preserve:

- Hero hierarchy
- Product cards
- Typography scale relationships
- Brand identity

Avoid generic mobile commerce patterns.

---

# DEVELOPMENT WORKFLOW

PHASE 1
Rebuild homepage.

PHASE 2
Compare with approved screenshot.

PHASE 3
Reach 95% fidelity.

PHASE 4
Extract reusable design system.

PHASE 5
Build remaining pages.

If homepage is not approved, do not proceed.

---

# FINAL ACCEPTANCE CRITERIA

A screen is approved only if:

- It immediately feels like Vakaa.
- It visually matches the approved homepage.
- It looks luxury.
- It looks editorial.
- It looks handcrafted.
- It avoids generic ecommerce patterns.
- It could be shown beside the approved homepage without looking like another website.

Failure on any criterion requires redesign.
