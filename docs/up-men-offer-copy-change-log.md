# UP MEN — Offer Copy Change Log

Branch: `cro/up-men-offer-copy-alignment`
Base: `main` @ `7131cc1`
Date: 2026-08-08

**Internal document. Not published to the storefront** (excluded via `.shopifyignore`).

---

## 0. BLOCKERS — resolve before pushing

### BLOCKER — LOOP RENEWAL PRICE IS $118, NOT $141

The approved commercial configuration is `$118 first order → $141 every 90 days`.
Loop is not configured that way. Verified twice against the live store:

```
product 3-month-auto-renew-subscription / variant 55350470902051
  selling plan 9573695779 "Deliver every 3 months"
  price_adjustments: [{ order_count: null, position: 1, value_type: "fixed_amount", value: 0 }]
  per_delivery_price: 11800   ($118.00)
```

`order_count: null` means the adjustment applies to every delivery, and the
adjustment is zero. Shopify will charge **$118 on every renewal**.

Per the standing instruction ("não publique uma renovação de US$141 se o checkout
estiver configurado em US$118"), the renewal figures on this branch were written
as **$118**, not $141. Nothing false can ship as-is.

**To flip to $141 after Loop is corrected** — two Theme Editor fields, no code:

| Block | Current text on this branch | Text once Loop charges $141 |
|---|---|---|
| `pricing.blocks.kit_perk_3` | `Then $118 every 90 days` | `Then $141 every 90 days` |
| `pricing.blocks.kit_perk_4` | `You’ll pay $118 today. Your next charge is $118 in 90 days unless you skip, pause or cancel before renewal.` | `You’ll pay $118 today. Your next charge is $141 in 90 days unless you skip, pause or cancel before renewal.` |

Re-run the cart verification (section 5) after the Loop change and confirm
`per_delivery_price` returns `14100` before publishing the new text.

Note also: `$118` must be an introductory price on the subscription plan, not a
Shopify BOGO discount. A BOGO discount would not survive into renewals and would
break the "Month 3 free on your first order" framing.

### BLOCKER — FINAL LABEL ARTWORK AND CLAIM DOCUMENTATION REQUIRED

The Supplement Facts image rendered on the page comes from the Shopify CDN
(`templates/index.json` → `product_label.settings.label_image` →
`shopify://shop_images/gen_2656_0_1783841183087.png`), not from the repo asset.
It is treated as a provisional reference only. Its legible values were used to fix
internal contradictions on the page; no claim was expanded on its basis.

Still required before the label is treated as final:

- Print-ready PDF from the manufacturer.
- Legible "Other Ingredients" list (currently unreadable/corrupted).
- Correct distributor name and address.
- Directions for use.
- Warnings.
- Documentation supporting "Made in USA", "Third-Party Tested" and "Non-GMO".
- Confirmation of the final batch and packaging.

### BLOCKER — REPO IS OUT OF SYNC WITH THE PUBLISHED THEME

`getupmen.com` runs this same theme (`theme-upmen/main`, id `187338752291`), but
it has been edited in the Theme Editor since the last sync commit (2026-08-04).
Pushing this branch reverts those edits. Confirmed differences:

| Setting | This repo (before my edits) | Published |
|---|---|---|
| `pricing.offer_enabled` | `false` | `true` |
| `pricing.countdown_target` | `2026-07-31T23:59:59` | `2026-08-05T23:59:59` |
| `announcement-bar.show_countdown` | `false` | `true` |
| `hero.media_enabled` | `false` | `true` |
| `pricing` `kit_addon` blocks | 7 | 5 |
| Home sections | 16 | 17 (extra `facility_8RXmCa`) |

Run `shopify theme pull` and re-apply this branch on top before pushing, or accept
that `facility_8RXmCa` and the newer editor edits are dropped.

I did **not** change `hero.media_enabled` — whichever value ends up live, the tag
copy on it is now correct.

---

## 1. Countdown — decision 1 applied

| Item | Value |
|---|---|
| Old | Live countdown counting down to `2026-08-05T23:59:59` — already expired, frozen at `00d:00h:00m:00s` |
| New | Countdown disabled; static `LIMITED-TIME WELCOME OFFER` label in the same slot |
| Files | `sections/pricing.liquid` (markup + CSS + schema), `templates/index.json`, `sections/announcement-bar.liquid`, `sections/header-group.json` |
| Dynamic/hardcoded | Setting-driven, editable in the Theme Editor |

The original timer never reset per visitor or per session — it read a fixed date
from settings. The problems were that the date had expired, had been manually
pushed forward (07-31 → 08-05), and was parsed in the visitor's **local** timezone
(`new Date("...T23:59:59")` with no `Z`), so it ended at a different instant for
each timezone.

The new fallback preserves the row's footprint: `.mm-offer-static` uses the same
background, border, radius and `min-height` as `.mm-offer-unit`
(52px mobile / 74px desktop), so nothing above or below shifts.

`countdown_enabled` now defaults to `false` and `countdown_target` to empty, with
schema `info` text warning that an expired date freezes the timer. Turning the
timer back on requires deliberately entering a real date.

No "while supplies last" wording was introduced anywhere.

---

## 2. Top bar and header

| Old | New | File · line | Note |
|---|---|---|---|
| `CLAIM YOUR OFFER` | `FIRST 90-DAY ORDER:` | `sections/header-group.json:17` | hidden below 768px |
| `50% OFF` | `BUY 2, GET 1 FREE` | `sections/header-group.json:18` | orange pill, always shown |
| `+ $70 FREE GIFTS` | `+ 5 WELCOME GIFTS` | `sections/header-group.json:19` | desktop |
| — | `+ 5 GIFTS` | `sections/header-group.json:20` | new `post_text_mobile`, below 768px |
| `50% OFF LAUNCH KIT` | `VIEW 90-DAY OFFER` | `sections/header-group.json:32` | header CTA, link unchanged (`#join_pkg`) |
| `CLAIM 50% OFF NOW` | `VIEW THE 90-DAY OFFER` | `config/settings_data.json:209` | footer CTA |

Mobile result: `[BUY 2, GET 1 FREE] + 5 GIFTS` — one line at 390px.
Desktop result: `FIRST 90-DAY ORDER: [BUY 2, GET 1 FREE] + 5 WELCOME GIFTS`.

Small markup change in `sections/announcement-bar.liquid`: the pre/post text are
now wrapped in `.mm-pre` / `.mm-post-d` / `.mm-post-m` spans with a display swap at
768px. Justified under the mobile-overflow clause — the full desktop string wraps
to two lines at 390px.

---

## 3. Hero

| Old | New | Source |
|---|---|---|
| `4,548 REVIEWS` | `VERIFIED CUSTOMER FEEDBACK` | `index.json` → `hero.reviews_text` |
| `UP MEN / THE MOST / POTENT & NATURAL / TESTOSTERONE STACK ON EARTH` | `ONE DAILY FORMULA.` + orange `A STRONGER 90-DAY ROUTINE.` | `hero.title_line1` / `title_highlight`; lines 2 and 3 emptied |
| `8 powerful ingredients packed into one daily male-vitality supplement.` | `9 active ingredients in one daily men’s wellness formula, designed to simplify consistency around training, nutrition, sleep and everyday routines.` | `hero.subtitle` |
| `UNLOCK YOUR POWER TODAY` | `SEE THE 90-DAY OFFER` | `hero.cta_label` — link unchanged, still `#join_pkg` |
| `TRY IT FOR 90 DAYS. HIGHER T OR YOUR MONEY BACK.` | `BUY 2, GET 1 FREE · 5 WELCOME GIFTS · 90-DAY SATISFACTION GUARANTEE` | `hero.guarantee_text` (the microcopy slot under the CTA) |
| `GET` / `50% OFF TODAY` | `FIRST ORDER` / `BUY 2, GET 1 FREE` | `hero.media_tag_top` / `media_tag_main` |

Liquid change in `sections/hero.liquid`: the `<h1>` emitted a `<br>` after every
line regardless of content. With lines 2 and 3 now empty that left two blank rows.
Each line now emits its own `<br>` only when it has content.

The hero microcopy carries the guarantee wording, so both requested replacements
("microcopy under the CTA" and "replace HIGHER T OR YOUR MONEY BACK") land in the
same single slot without duplicating text.

---

## 4. "The Solution" section

| Slot | Old | New |
|---|---|---|
| `story.solution_title` | `THE SOLUTION?` | `THE SIMPLER WAY TO STAY CONSISTENT` |
| `story.solution_lede` | `Maintaining balanced testosterone levels is pivotal…` | `UP MEN brings 9 active ingredients into one daily men’s wellness formula, designed to fit alongside training, nutrition, sleep and the routines that already matter.` |
| benefit-1 | `SKYROCKET ENERGY & STAMINA` / `Increase energy & athletic performance` | `ONE DAILY FORMULA` / `Simplify the supplementation step.` |
| benefit-2 | `SUPPORT MALE VITALITY` / `Amplify passionate energy` | `BUILT FOR CONSISTENCY` / `A routine designed to be repeated.` |
| benefit-3 | `ENHANCE PRODUCTIVITY & FOCUS` / `Stay sharp & focused all day` | `MADE FOR REAL SCHEDULES` / `Easy to take at home or on the go.` |
| benefit-4 | `SUPERCHARGE STRENGTH` / `Build & maintain lean muscle mass` | `90-DAY STRUCTURE` / `A clear routine with fewer daily decisions.` |
| benefit-5 | `IMPROVE RECOVERY` / `Optimize sleep & muscle recovery` | `TRANSPARENT FORMULA` / `Exact amounts shown on the Supplement Facts.` |

Icons, icon images, order and layout untouched. None of the banned words
(skyrocket, supercharge, increase testosterone, libido, muscle, fat, erections,
fatigue, optimize hormones) survive in these five cards.

---

## 5. Ingredients and Supplement Facts — decision 4 applied

8 cards kept. No ninth card created. One card now carries both K vitamins with
both amounts spelled out.

| Card | Old dose | New dose | Reason |
|---|---|---|---|
| Tongkat Ali | `1000 mg` | `1,000 mg` | match label formatting |
| `K1 & K2` | `100 mcg` | name → `Vitamin K1 + K2`, dose → `100 mcg K1 + 100 mcg K2` | the old text could read as 100 mcg total for both |
| Vitamin D | `4000 IU` | `100 mcg (4,000 IU)` | match label |
| **Fenugreek** | **`675 mg`** | **`1,000 mg`** | **page contradicted the Supplement Facts** |

| Slot | Old | New |
|---|---|---|
| `ingredients.title` | `8 INGREDIENTS IN 1 POWERFUL FORMULA` | `9 ACTIVE INGREDIENTS IN 1 DAILY FORMULA` |
| `ingredients.subtitle` | `CLINICALLY DOSED + EFFECTIVE` | `EXACT AMOUNTS SHOWN ON THE SUPPLEMENT FACTS` |
| `product_label.heading` | `Here's What's Inside Every Capsule` | `Here's What's Inside Each Daily Serving` |
| timeline MONTH 3 | `All 8 ingredients working like a tuned engine` | `All 9 active ingredients working together in one daily serving` |
| about page stat | `8` / `Clinically dosed ingredients` | `9` / `Active ingredients per daily serving` |
| article CTA | `Eight research-dosed ingredients … 90-day higher-T guarantee.` | `Nine active ingredients in one daily serving, covered by our 90-day satisfaction guarantee.` |

`use_text` was already correct (`take 5 capsules daily with food`) and was kept.

One CSS line added: `.mm-dose { line-height: 1.25 }`, so the two-amount K card wraps
to a second line cleanly instead of cramping. No font size, colour or spacing change.

---

## 6. Offer block

| Slot | Old | New |
|---|---|---|
| section title | `GET YOUR FIRST MONTH FREE` | `CHOOSE YOUR UP MEN ROUTINE` |
| section description | *(no slot existed)* | `Start with 30 days or get the complete 90-day routine with Month 3 free.` |
| offer tag | `GET` / `50% OFF TODAY` | `FIRST ORDER` / `BUY 2, GET 1 FREE` |
| note under the header | `🚨 August has a high risk of selling out — 2140 purchases made today.` | `🎁 ALL WELCOME GIFTS SHIP WITH YOUR FIRST ORDER` |
| guarantee note (section footer) | `90-DAY HIGHER-T GUARANTEE · TRY IT RISK-FREE` | `COVERED BY OUR 90-DAY SATISFACTION GUARANTEE` |
| shipping note | `**Ships in 24h** if ordered today.` | `Order processing and delivery estimates are shown at checkout.` |

A `subtitle` setting was added to the section — the description the brief asks for
had nowhere to go. The eyebrow is now guarded by `!= blank`; previously an empty
eyebrow rendered a stray orange padding block.

The month prefix and the highlighted number in the scarcity note are now behind
`scarcity_show_month` and a blank check, so the note can carry plain copy. The
`🚨` emoji became a `scarcity_icon` setting, now `🎁`.

### 90-day card

| Slot | Old | New |
|---|---|---|
| ribbon | `FLASH SALE · 1ST MONTH FREE` | `BEST VALUE · BUY 2, GET 1 FREE` |
| badge | `3-MONTH AUTO-RENEW SUBSCRIPTION` | `90-DAY SUBSCRIPTION` |
| name | `3-MONTH PLAN` | `90-DAY ROUTINE` |
| subtitle | `The complete 90-day protocol` | `3 bottles delivered together` |
| CTA | `Start My 90-Day Protocol →` | `START MY 90-DAY ROUTINE` |

✓ list — was 7 rows including `Free 1st Bottle`, `UP MEN Capsule Case $10`,
`UP MEN Testosterone Guide $20`, `1 Month of Ladder Workout App $30`,
`Surprise Gift`. Now 10 rows:

```
3 bottles · 90-day supply
Month 3 is FREE on your first order
Complete Welcome Kit included
FREE U.S. shipping on your first order
YOUR COMPLETE WELCOME KIT                    ← heading row, no ✓
Free UP MEN Branded Thermal Bottle
Free Smart Activity Band
Free UP MEN Crossbody Pack
Free Keychain Pill Case
Free UP MEN Men’s Wellness Guide (Digital)
```

Perks under the button — was 3 rows. Now 6:

```
$39.33/month on your first order
You save $59 today
Then $118 every 90 days                      ← GATED, see BLOCKER
You’ll pay $118 today. Your next charge is $118 in 90 days unless you
  skip, pause or cancel before renewal.      ← GATED, see BLOCKER
All 3 bottles and all physical welcome gifts ship together in your first
  order. The digital guide is delivered by email. Welcome gifts are
  included once and are not repeated on renewals.
Covered by our 90-day satisfaction guarantee.
```

### Monthly card

| Slot | Old | New |
|---|---|---|
| badge | `AUTO-SHIP & SAVE` | `FLEXIBLE START` |
| name | `MONTHLY PLAN` | `30-DAY ROUTINE` |
| subtitle | `1-month supply, delivered monthly` | `1 bottle delivered every 30 days` |
| CTA | `Try Up Men →` | `START WITH 30 DAYS` |

✓ list — was 5 rows including `$15 off your first order / Save $15` (a discount
that does not exist: the variant is $59 with no compare-at price). Now 7 rows:

```
1 bottle · 30-day supply
Starter Welcome Kit included
FREE U.S. shipping on your first order
YOUR STARTER WELCOME KIT                     ← heading row, no ✓
Free UP MEN Branded Thermal Bottle
Free Keychain Pill Case
Free UP MEN Men’s Wellness Guide (Digital)
```

Perks — was 2 rows. Now 4. All figures verified against Loop, none gated:

```
Then $59 every 30 days
You’ll pay $59 today. Your next charge is $59 in 30 days unless you
  skip, pause or cancel before renewal.
Your bottle and physical starter gifts ship together in your first order.
  The digital guide is delivered by email. Welcome gifts are included once
  and are not repeated on renewals.
Covered by our 90-day satisfaction guarantee.
```

### Prices

All prices on both cards are dynamic. Nothing was hardcoded.

`snippets/mm-plan-price.liquid` (new) renders the price row. It resolves the
variant's `selling_plan_allocation` for the plan actually being submitted and shows
`per_delivery_price`, falling back to the plain variant price when there is no
match. Previously the card showed `variant.price` regardless of which plan was
attached. A `price_suffix` setting (`TODAY`) renders after the amount, giving
`$118.00 TODAY` / `$59.00 TODAY`.

The placeholder `once_price` was `$44` — stale, and it would have rendered if the
product were ever disconnected. Corrected to `$59`.

### Third card (disabled)

`third_enabled` is `false`, so this card is not public. Its blocks still carried
`90-day higher-T money-back guarantee` and unverified gift values
(`$10`, `$20`, `$90`). Sanitised down to 3 ✓ rows and 2 perks rather than deleted,
so the configuration survives if the 6-month plan is ever switched on.

---

## 7. Gifts — decision 5

Copy applied in full. **The images do not match and could not be fixed here.**

The gift strip is a fixed 4-image grid (`for i in (1..4)`,
`grid-template-columns: repeat(4, 1fr)`) reading from `assets/free-gift-1..4.png`.
What those files actually show:

| Asset | Shows | Matches the new kit? |
|---|---|---|
| `free-gift-1.png` | sliding metal pill case | partial — not a keychain |
| `free-gift-2.png` | e-book cover branded **"MARS MEN — GALACTIC TESTOSTERONE GUIDE"** | **no — wrong brand** |
| `free-gift-3.png` | phone running a workout app ("POWER FLEX & FLOW") | no — not in the new kit |
| `free-gift-4.png` | black smartwatch | yes → Smart Activity Band |

Nothing depicts the Thermal Bottle or the Crossbody Pack. Per the instruction not
to alter images, the files were left alone and only the captions were rewritten:

| Old caption | New caption |
|---|---|
| `Free gift: metal storage case` | `Welcome gift: UP MEN Branded Thermal Bottle` |
| `Free gift: testosterone cheat sheet` | `Welcome gift: UP MEN Crossbody Pack` |
| `Free gift: high-T cookbook` | `Welcome gift: Keychain Pill Case` |
| `Free gift: 90-day tracker` | `Welcome gift: Smart Activity Band` |

**The captions now describe items the images do not show.** This is the single
worst-looking thing on the branch and needs assets before publishing.

`PENDING — GIFT IMAGERY`. Required:
- Photographs of the four real physical items.
- `free-gift-2.png` replaced — it carries a competitor/legacy brand name.
- If the guide is to appear as a fifth tile, the grid must go to 5 columns and the
  loop to `(1..5)`. That is a layout change and needs separate authorisation.
- Per the brief: gifts smaller than the bottles, bottles as the hero, no premium
  smartwatch if the real item is a simple band, no medical UI (no blood pressure,
  ECG, glucose or diagnostic readouts) on the Smart Activity Band.
- The physical gifts must be single-purchase SKUs, not attached to the recurring
  Loop selling plan, or renewals will re-ship them.

Naming note: this round used the names from the latest brief — `UP MEN Crossbody
Pack`, `Keychain Pill Case`, `UP MEN Men’s Wellness Guide (Digital)`. The earlier
brief said `UP MEN Crossbody Waist Pack`, `Pill Holder Keychain` and
`UP MEN Testosterone & Lifestyle Guide (Digital)`. Confirm which set is correct;
it is a find/replace in `templates/index.json` either way.

---

## 8. Guarantee

| Slot | Old | New |
|---|---|---|
| badge | `90-DAY HIGHER-T GUARANTEE` | `90-DAY SATISFACTION GUARANTEE` |
| headline | `BOOST YOUR TESTOSTERONE IN 90 DAYS` | `TRY THE UP MEN ROUTINE FOR 90 DAYS` |
| body | `Try Up Men risk-free for 90 days. If you're not satisfied, we will refund you, no questions asked. Reclaim your masculinity, risk-free.` | `Your purchase is covered by our 90-day satisfaction guarantee. If UP MEN is not the right fit for you, request a refund according to the published guarantee terms.` |
| CTA | `TRY IT NOW` → `#join_pkg` | `REVIEW THE 90-DAY GUARANTEE` → `/policies/refund-policy` |

`/policies/refund-policy` returns HTTP 200 and reads: *"You have 90 days from the
day your order is delivered to request a refund… You do not need to send anything
back."* It makes no hormonal claim, so it supports the new wording.

Naming note: the published policy calls it a "90-day money-back guarantee"; the
page now says "90-day satisfaction guarantee". Same thing, two names — worth
aligning one way or the other.

Also cleared elsewhere: contact page, help centre, about page, article template.

---

## 9. Stats strip

| Block | Old | New |
|---|---|---|
| 1 | `90%` / `rated Up Men effective at improving testosterone levels*` | `9` / `ACTIVE INGREDIENTS WITH EXACT AMOUNTS SHOWN` |
| 2 | `64%` / `saw better results with Up Men than competing T support*` | `90 DAYS` / `3 BOTTLES DELIVERED TOGETHER` |
| 3 | `93%` / `reported trusting the quality & transparency of Up Men's ingredients*` | `FLEXIBLE` / `SKIP, PAUSE OR CANCEL BEFORE RENEWAL` |
| footnote | `*Based on a survey of past and current Up Men customers in 2026.` | *(empty)* |

No survey backing those percentages exists in the repo. Layout, colours and type
scale untouched — the numbers were already free text.

---

## 10. Reviews

| Slot | Old | New |
|---|---|---|
| title | `WHAT MEN ARE SAYING` | `WHAT VERIFIED CUSTOMERS SAY` |
| subtitle | *(no slot existed)* | `Real feedback on routine, delivery, value and support.` |
| count line | `Based on 4,548 reviews` | `VERIFIED CUSTOMER FEEDBACK` |
| hero star line | `4,548 REVIEWS` | `VERIFIED CUSTOMER FEEDBACK` |

No review was written, edited, deleted or invented. No name, photo, country or
verified badge was created. A `subtitle` setting was added to the section.

`PENDING — REVIEW PROVENANCE`. Still unverifiable and left in place because
removing them changes the layout, not just the copy:

- `avg_rating` = `4.8` and the five-star graphic next to it.
- `dist_pcts` = `86|8|3|1|2` and `dist_counts` = `3,911|364|136|46|91` — a
  breakdown of the fabricated 4,548 total. These sit in the middle column of a
  three-column grid; blanking them leaves a hole.
- The four review bodies, of unknown provenance.
- `review-3` still says *"Ordered the Launch Kit"* — a plan name that no longer
  exists. **Left deliberately**: the instruction is not to alter review bodies.
  It should be replaced along with the block, not edited.
- `photo_1..4` and the per-review photo fallbacks are theme preview images.

No reviews app is installed (checked the published HTML for Judge.me, Okendo,
Loox, Yotpo, Stamped and Junip — none present). See
`docs/review-collection-brief.md`.

---

## 11. FAQ

Accordion, block type and count (10) unchanged. All ten questions and answers
replaced with the approved set. Question 9 states no processing time — only that
estimates and tracking come from checkout and email.

Removed by this: `results in 7 days`, `T-production is fully optimized`,
`ships every 30 days at 50% off the one-time price`,
`Orders placed today ship within 24 hours`.

---

## 12. Subscription transparency

Both cards now state, in slots that already existed, before the button is clicked:

| Question | 90-day card | Monthly card |
|---|---|---|
| Charged today | `$118.00 TODAY` (dynamic) | `$59.00 TODAY` (dynamic) |
| What arrives | `3 bottles · 90-day supply` | `1 bottle · 30-day supply` |
| Next charge, when | `in 90 days` | `in 30 days` |
| Next charge, how much | `$118` *(gated — see BLOCKER)* | `$59` (verified) |
| How to stop it | `unless you skip, pause or cancel before renewal` | same |

The phrase "cancel anytime" was removed everywhere. It is replaced by
"skip, pause or cancel **before renewal**", which does not imply that an order
already processed can be cancelled or refunded. No legal term was altered — the
Subscription Policy and Refund Policy are untouched.

---

## 13. Selling plan fix — decision 7

Authorised, minimal, applied to `sections/pricing.liquid`.

**Before**, the monthly card only attached a selling plan when
`variant.requires_selling_plan` was true. The `monthly-plan` product allows
one-time purchase, so that flag is `false` and the plan was never attached. The
published page proved it — the monthly form had no `selling_plan` input at all:

```html
<input type="hidden" name="id" value="55350471033123">
<input type="hidden" name="quantity" value="1">
```

Customers clicking "Try Up Men →" bought once, while the card promised a renewal.

**After** — same rule as the 90-day card, plus a `selling_plan_once` override that
the schema was missing entirely:

```liquid
{%- assign sp1 = section.settings.selling_plan_once -%}
{%- if sp1 == blank and p1.selling_plan_groups.size > 0 -%}
  {%- assign sp1 = p1.selling_plan_groups.first.selling_plans.first.id -%}
{%- endif -%}
```

The same latent bug on the disabled third card was aligned in passing (one
condition removed).

Preserved: variant IDs, product handles, checkout route (`return_to=/checkout`),
cart-drawer interception, quantity stepper, pixels and tracking, card layout,
plan order.

Verified against the live store (anonymous cart, no order created, cart cleared
afterwards):

```
MONTHLY PLAN            variant 55350471033123  $59.00 today
  selling_plan 9574056227  "Deliver every month"    recurring: true
  per_delivery_price: $59.00

3-MONTH AUTO-RENEW      variant 55350470902051  $118.00 today
  selling_plan 9573695779  "Deliver every 3 months" recurring: true
  per_delivery_price: $118.00
```

Both plans are accepted by Shopify and both create recurring line items. The
$118 `per_delivery_price` on the 90-day plan is the evidence behind the renewal
blocker.

---

## 14. Pending confirmations

### PENDING CONFIRMATION — REAL FULFILLMENT SLA AND RECURRING SHIPPING RATE

- `Ships in 24h if ordered today.` was removed from both cards and replaced with
  `Order processing and delivery estimates are shown at checkout.` FAQ 9 no longer
  states a shipping deadline. Restore a real SLA only once the operation confirms
  one.
- Shipping copy stays at `FREE U.S. shipping on your first order`. Whether free
  shipping is genuinely first-order-only cannot be determined from the theme —
  rates live in Shopify Admin → Settings → Shipping.
- If renewals also ship free, report it before switching to
  `FREE U.S. SHIPPING ON EVERY SUBSCRIPTION SHIPMENT`. That text was **not**
  published.

### PENDING — GIFT IMAGERY
See section 7.

### PENDING — TIMELINE SECTION
`YOUR RESULTS CALENDAR` was out of scope, but two banned strings lived there and
were replaced: `T-production optimized fully` → `The daily serving is fully part of
your routine`, and `Not temporary, this is your new normal` → `A routine you can
keep repeating`. The rest of the section still promises physiological outcomes on
a timetable (`Boron helps free stuck T`, `Body looks leaner, stronger, more
masculine`, `Strength, sleep and mood at a new baseline`,
`Welcome to the man you're supposed to be`). Needs its own decision.

### PENDING — INGREDIENT DESCRIPTIONS
The eight ingredient cards still carry claims like *"Boosts testosterone, enhances
libido, improves fertility"*. Only the doses were in scope this round. These read
as drug claims and should be reviewed.

### PENDING — GUARANTEE NAMING
Policy says "90-day money-back guarantee"; page now says "90-day satisfaction
guarantee".

---

## 15. Strings that intentionally remain

| String | Where | Why |
|---|---|---|
| `Ordered the Launch Kit` | `templates/index.json` review-3 body, and the same text in the `sections/reviews.liquid` preset | Instruction: do not alter review bodies. Replace the whole block with a real review instead. |
| `4.8` average rating | `templates/index.json` reviews | Removing it leaves an empty number beside five stars. Flagged under PENDING — REVIEW PROVENANCE. |
| `86\|8\|3\|1\|2` / `3,911\|364\|136\|46\|91` | `templates/index.json` reviews | Middle column of a three-column grid; blanking it breaks the layout. Same pending item. |

None of the mandated removals survive. Verified by repo-wide search:
`50% OFF`, `$70 FREE GIFTS`, `GET YOUR FIRST MONTH FREE`, `FREE 1ST BOTTLE`,
`HIGHER T OR YOUR MONEY BACK`, `BOOST YOUR TESTOSTERONE IN 90 DAYS`,
`2140 PURCHASES MADE TODAY` — zero matches.

---

## 16. Files touched

```
.shopifyignore                        new — keeps docs/ off the storefront
docs/review-collection-brief.md       new
docs/up-men-offer-copy-change-log.md  new
snippets/mm-plan-price.liquid         new — selling-plan-aware price row

config/settings_data.json             sticky bar copy, footer CTA
sections/header-group.json            top bar copy, header CTA
templates/index.json                  all live home page copy
templates/article.json                CTA text
templates/page.about.json             guarantee text, ingredient count
templates/page.contact.json           guarantee text
templates/page.help-center.json       guarantee text

sections/announcement-bar.liquid      mobile copy swap + schema defaults
sections/hero.liquid                  headline <br> guard + schema defaults
sections/pricing.liquid               countdown fallback, scarcity guards,
                                      section subtitle, price snippet,
                                      monthly selling plan fix, schema, preset
sections/story.liquid                 schema defaults + preset
sections/ingredients.liquid           schema defaults, preset, dose line-height
sections/product-label.liquid         heading default
sections/scarcity-cta.liquid          schema defaults
sections/how-it-works.liquid          schema defaults + preset
sections/reviews.liquid               subtitle slot + schema defaults
sections/faq.liquid                   preset (10 Q&A)
sections/sticky-footer.liquid         schema defaults
sections/timeline.liquid              preset (banned strings)
sections/footer.liquid                CTA default
sections/header.liquid                CTA default + preset
sections/about-stats.liquid           preset
sections/main-article.liquid          CTA default
sections/page-contact.liquid          preset
sections/page-help-center.liquid      preset
snippets/mm-addon-row.liquid          "heading" row style
```

Schema defaults and presets were updated alongside the JSON values so that
re-adding a section, or restoring a preset, cannot reintroduce banned copy. The
JSON remains the single source of what renders; the Liquid defaults are the
fallback, not a duplicate source. Every string stays editable in the Theme Editor.

---

## 17. QA results

| Check | Result |
|---|---|
| Shopify Theme Check | 72 offenses on `main`, 72 on this branch — **no new offenses**. All pre-existing (`ImgWidthAndHeight`, `OrphanedSnippet`). |
| Build/test scripts | None exist (no `package.json`, no `.theme-check.yml`). |
| JSON validity | 19 JSON files + all 44 section schemas parse cleanly. |
| Broken references | `pricing.block_order` 32 entries ↔ 32 blocks, no orphans, no dangling ids. |
| Section order | Unchanged, 16 sections, identical to `main`. |
| Monthly plan → cart | **Fixed.** Now adds with `selling_plan 9574056227`, recurring. |
| 90-day plan → cart | Adds with `selling_plan 9573695779`, recurring, $118. |
| First-order price | $118 / $59, dynamic, matches Shopify. |
| Renewal price | $118 / $59 per `per_delivery_price`. **90-day conflicts with the approved $141.** |
| Checkout | Not exercised — would create a real order. Forms post to `/cart/add` with `return_to=/checkout`, unchanged. |
| Subscription portal | `/pages/manage-subscription`, `/policies/subscription-policy`, `/policies/refund-policy` all HTTP 200. Portal is still `portal_mode: "account"` with `app_url` empty — the Loop portal is not wired up. |
| CTA scroll | All CTAs still target `#join_pkg`; the anchor still exists on `<section class="mm-pricing" id="join_pkg">`. |
| Countdown | Disabled; static label in the same box. |

Rendering was verified by reading the generated markup and CSS, not in a browser —
`shopify theme dev` needs store authentication that is not available in this
session. Widths were checked against the existing type scale:

| Viewport | Check | Result |
|---|---|---|
| 1440px | top bar full string | one line |
| 1440px | ribbon `BEST VALUE · BUY 2, GET 1 FREE` | ~260px in a ~482px card, `nowrap` holds |
| 1440px | stats `FLEXIBLE` at 56px | ~270px in a ~356px column |
| 1440px | static offer label | ~344px, matches the 4-unit timer row it replaces |
| 768px | cards stack 1fr 1fr | unchanged |
| 390px | top bar shows `[BUY 2, GET 1 FREE] + 5 GIFTS` | one line |
| 390px | sticky bar headline (40 chars at 15px) | **wraps to two lines**, bar grows ~18px, nothing clipped |
| 390px | K1 + K2 dose | wraps to two lines by design, `line-height: 1.25` added |
| 390px | perk paragraphs at 12.5px | wrap normally, no overflow |

The sticky-bar wrap is the one visual change worth a look. Shortening the headline
avoids it; no CSS was changed for it, since nothing overflows or is cut off.
