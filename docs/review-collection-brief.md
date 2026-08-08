# UP MEN — Review Collection Brief

**Internal document. Not published to the storefront** (excluded via `.shopifyignore`).

## Why this exists

The offer page currently carries four review blocks and a review count that were
written into the theme rather than collected from customers. They are placeholders,
not evidence. This brief is the input for collecting real feedback that can replace
them.

Nothing in this file may be used to write a review. These are questions to send to
real customers. Only their own words go on the page.

## Rules for whoever runs the collection

- Send only to customers with a fulfilled order.
- Do not offer payment, discounts or gifts in exchange for a positive review.
- Publish the customer's own words. Fix typos only; do not rewrite.
- Never publish a name, photo, country or "verified" badge that the customer did
  not actually provide.
- Do not solicit or publish claims about testosterone levels, hormones, bloodwork,
  erectile function, weight loss or any medical outcome.
- Keep the raw responses on file. If a review is published, its source must be
  traceable to a real order.

## Questions to send

1. What made you choose the 30-day or 90-day plan?
2. Was the subscription price and renewal schedule clear?
3. Did your product and welcome gifts arrive together?
4. Which welcome gift have you used most?
5. Did UP MEN make your daily supplement routine easier to organize?
6. How was your experience with delivery and packaging?
7. Did you contact support? How was the experience?
8. What would you tell someone comparing the two plans?

## What to prioritise when selecting reviews for the page

The offer page has to answer objections about the subscription and the welcome kit.
When real responses exist, favour the ones that speak to:

- Clarity of the subscription (what was charged, and when).
- Quality of the packaging.
- The three bottles arriving together on the 90-day plan.
- Receiving the full welcome kit.
- Simplicity of the daily routine.
- How easy it was to skip, pause or cancel.
- Support responsiveness.
- Perceived value of the 90-day plan versus the monthly plan.
- The delivery experience.
- Actually using the starter kit items.

## What must be replaced once real data exists

| Where | Current placeholder | Replace with |
|---|---|---|
| `templates/index.json` → `reviews.settings.avg_rating` | `4.8` | live average from the reviews app |
| `templates/index.json` → `reviews.settings.dist_pcts` | `86\|8\|3\|1\|2` | live distribution |
| `templates/index.json` → `reviews.settings.dist_counts` | `3,911\|364\|136\|46\|91` | live counts |
| `templates/index.json` → `reviews.blocks.review-1..4` | four written reviews | collected reviews |
| `templates/index.json` → `reviews.settings.photo_1..4` | stock/preview images | real customer photos, with consent |
| `templates/index.json` → `hero.settings.reviews_text` | `VERIFIED CUSTOMER FEEDBACK` | live count, once an app supplies it |

Until a reviews app is installed, the review count stays hidden — the theme now
renders `VERIFIED CUSTOMER FEEDBACK` in place of a number.
