# UP MEN — Offer Copy Change Log

Branch: `cro/up-men-offer-copy-alignment-v2` (integration, uncommitted)
Checkpoint: `20ebde7` on `cro/up-men-offer-copy-alignment`
Live-theme snapshot: `b980419` on `sync/live-theme-2026-08-08`
Preview theme: #187428700451 "CRO offer copy v2 — DO NOT PUBLISH" (unpublished)
Base: published theme `theme-upmen/main` #187338752291 == `origin/main` @ `0d64fe3`
Date: 2026-08-08

**Internal document. Not published to the storefront** (excluded via `.shopifyignore`).

---

## 0. Status and blockers

Round 1 shipped the copy rewrite against a stale base. Round 2 reframed the 90-day
plan as a continuing subscriber rate, integrated the published theme, and produced
an unpublished preview. Round 1 blockers that are now closed are listed as such.

### CLOSED — renewal price conflict

Round 1 held the renewal figure because Loop charges $118 while the brief asked for
$141. The decision is now to keep Loop as it is and communicate the real rate:

```
FIRST ORDER: $118
RENEWS AT $118 EVERY 90 DAYS
```

The 90-day plan is framed as a continuing subscriber benefit — 3 bottles for the
price of 2 on every shipment — not a first-order discount. `Month 3 free`,
`introductory price`, `first-order product discount` and `$141` do not appear
anywhere in the theme. Welcome gifts remain exclusive to the first shipment.

Verified against the store: `per_delivery_price` is `11800` for selling plan
`9573695779` and `5900` for `9574056227`. If either stops matching $118 / $59, the
copy is wrong and must be stopped — the figures in the perks are static text, since
the theme has no slot that renders a recurring price dynamically.

### CLOSED — repo out of sync with the published theme

Round 1 measured drift against `7131cc1`. `origin/main` had since advanced to
`0d64fe3` through five Shopify sync commits. A `shopify theme pull --live
--nodelete` produced a working tree byte-identical to `0d64fe3` (line endings
aside), so GitHub and the published theme were already in sync.

The published theme carries three things the old base did not, all preserved:

| Item | Published value | Kept? |
|---|---|---|
| `facility_8RXmCa` section | 17th section, between `testimonials` and `founder_story` | yes, untouched |
| `hero.media_enabled` | `true` | yes — the checkpoint had `false`; published wins |
| `pricing.offer_enabled` | `true` | yes |
| `pricing.blocks` `kit_5`, `kit_6` | `"disabled": true` on Ladder Workout App and Surprise Gift | superseded — both rows are gone from the approved gift list |

### BLOCKER — FINAL WELCOME GIFT ASSETS REQUIRED

The published theme does have gift images, but not the ones the copy needs. What
each slot actually contained:

| Slot | Published image | Verdict |
|---|---|---|
| `gift_1` | e-book cover reading **"UP MEN Testosterone Genetics Guide — Unlock Male Power Naturally"** | rejected: the digital guide should not occupy a physical-gift slot, and the artwork uses banned "Testosterone Guide" naming |
| `gift_2` | UP MEN branded thermal bottle | approved — moved to slot 1 |
| `gift_3` | UP MEN crossbody pack | approved — moved to slot 2 |
| `gift_4` | activity band beside a phone showing **heart rate, sleep and blood pressure** | rejected: medical readouts are explicitly banned |

No image of the Keychain Pill Case exists anywhere in the store or the repo.

Applied: slots reassigned so the four slots hold the four physical gifts in caption
order, with the two rejected slots emptied. The gift strip renders only when all
four slots are filled, so it is currently hidden. Nothing was invented or
substituted with generic art.

**Two files still required** (square, product on a plain light background, gift
shown smaller than the bottles, no medical UI):

1. `Keychain Pill Case` — the real keychain pill case that ships.
2. `Smart Activity Band` — the band alone, or with an app screen showing steps and
   activity only. No heart rate, blood pressure, ECG, glucose or any diagnostic
   readout. Do not show a premium smartwatch if the real item is a simple band.

Also pending, separately: the e-book artwork itself is titled "Testosterone
Genetics Guide". The approved name is `UP MEN Men's Wellness Guide`. The artwork
needs replacing before the guide is shown anywhere.

The four `assets/free-gift-*.png` files were deleted. They were the theme's
fallback art and showed a **MARS MEN**-branded e-book, a workout app on a phone and
a premium smartwatch — none of which ship.

### BLOCKER — LOOP CUSTOMER PORTAL NOT VERIFIED

Loop Subscriptions is installed and its storefront proxy works:

```
GET https://getupmen.com/a/loop_subscriptions/get-subscription-link   HTTP 200
serves Loop's portal app from loopwork.co/customerPortal/advent/...
```

But the theme does not route customers to it. `templates/page.manage-subscription.json`
is set to `portal_mode: "account"` with `app_url: ""`, so `/pages/manage-subscription`
— the destination of the footer's "Manage subscription" link — sends customers to
the Shopify customer account instead of Loop.

What could not be verified without a test customer holding a live subscription:
whether skip, pause and cancel are enabled inside Loop's portal, and whether the
next charge is visible there.

Applied: the FAQ no longer claims a self-serve portal. `CAN I SKIP, PAUSE OR
CANCEL?` now answers *"To change or cancel a future renewal, contact UP MEN support
before your next billing date."*

**Action required, not applied** — no Loop configuration was touched:

```
templates/page.manage-subscription.json
  "portal_mode": "account"   ->  "app"
  "app_url":     ""          ->  "/a/loop_subscriptions/get-subscription-link"
```

Confirm the portal exposes skip / pause / cancel before applying it, and before any
copy promises self-serve management.

Left in place and still asserting those actions, because the published Subscription
Policy documents them (*"skip a single upcoming delivery… pause… cancel the
subscription outright… no minimum term, no commitment period and no cancellation
fee"*):

- Stats strip block 3 — `SKIP, PAUSE OR CANCEL BEFORE RENEWAL`
- The renewal microcopy on both cards — `unless you skip, pause or cancel before renewal`
- `/pages/manage-subscription` and `/pages/help-center` body copy

If you want these softened too, say so — it is a settings change, not code.

### BLOCKER — REVIEW PROVENANCE NOT VERIFIED

No reviews app is installed. The published storefront HTML contains no Judge.me,
Okendo, Loox, Yotpo, Stamped or Junip integration, so there is no dynamic source to
bind to. Everything in the reviews section is static text written into the theme.

Applied: the review count is gone. `Based on 4,548 reviews` is now
`VERIFIED CUSTOMER FEEDBACK`, and the hero's `4,548 REVIEWS` is the same string.

Still static and unverifiable, **not** changed — a minimal option is proposed below
for approval rather than applied:

- `avg_rating` = `4.8`, beside a five-star graphic.
- `dist_pcts` = `86|8|3|1|2`, `dist_counts` = `3,911|364|136|46|91` — a breakdown of
  the fabricated 4,548 total.
- Four review bodies of unknown origin, one of which says *"Ordered the Launch Kit"*,
  a plan name that no longer exists.
- `photo_1..4` and the per-review photo fallbacks are theme preview images.

**Proposed minimal hide (awaiting approval, not applied).** The summary is a
three-column grid: average + stars | distribution | customer photos. Blanking the
numbers leaves a hole, so the clean move is one checkbox that collapses the grid to
the columns that survive:

```liquid
{%- comment -%} sections/reviews.liquid — around the .mm-summary wrapper {%- endcomment -%}
<div class="mm-summary{% unless section.settings.show_rating_summary %} is-lean{% endunless %}">
  {%- if section.settings.show_rating_summary -%}
    ... existing .mm-avg-row and .mm-dist ...
  {%- endif -%}
  ... existing .mm-photos ...
</div>
```

plus one CSS rule and one schema setting:

```css
#mm-rv-{{ sid }} .mm-summary.is-lean { grid-template-columns: 1fr; }
```

```json
{ "type": "checkbox", "id": "show_rating_summary", "label": "Show rating and distribution",
  "info": "Switch off until a reviews app supplies real numbers.", "default": true }
```

That is 3 lines of Liquid, 1 CSS rule and 1 setting. It removes 4.8, the stars and
the distribution, keeps the photo grid and the review list, and reverses with a
checkbox. See `docs/review-collection-brief.md` for the collection plan.

### PENDING CONFIRMATION — REAL FULFILLMENT SLA AND RECURRING SHIPPING RATE

- `Ships in 24h if ordered today.` is gone from both cards. Both now read
  `Order processing and delivery estimates are shown at checkout.` FAQ 9 states no
  deadline.
- Shipping copy stays at `FREE U.S. shipping on your first order`. Whether free
  shipping is genuinely first-order-only cannot be read from the theme — rates live
  in Shopify Admin → Settings → Shipping.
- `FREE U.S. SHIPPING ON EVERY SUBSCRIPTION SHIPMENT` was **not** published.

### BLOCKER — FINAL LABEL ARTWORK AND CLAIM DOCUMENTATION REQUIRED

Unchanged from round 1. The Supplement Facts image on the page comes from the
Shopify CDN (`shopify://shop_images/gen_2656_0_1783841183087.png`) and is treated as
a provisional reference only. Its legible values were used to fix internal
contradictions; no claim was expanded on its basis.

Still required: print-ready PDF from the manufacturer, a legible "Other Ingredients"
list, correct distributor name and address, directions for use, warnings,
documentation for "Made in USA" / "Third-Party Tested" / "Non-GMO", and confirmation
of the final batch and packaging.

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

---

## 18. Round 2 record — subscriber-rate reframe and live-theme integration

### Copy changed in round 2

| Slot | Round 1 | Round 2 |
|---|---|---|
| Top bar | `FIRST 90-DAY ORDER: [BUY 2, GET 1 FREE] + 5 WELCOME GIFTS` | `90-DAY PLAN: [3 BOTTLES FOR $118] + 5 WELCOME GIFTS` |
| Top bar (mobile) | `[BUY 2, GET 1 FREE] + 5 GIFTS` | `[3 BOTTLES FOR $118] + 5 WELCOME GIFTS` |
| Countdown box | `LIMITED-TIME WELCOME OFFER` | `WELCOME KIT INCLUDED WITH YOUR FIRST SHIPMENT` |
| Offer tag | `FIRST ORDER` / `BUY 2, GET 1 FREE` | `90-DAY PLAN` / `3 FOR THE PRICE OF 2` |
| Note under header | `ALL WELCOME GIFTS SHIP WITH YOUR FIRST ORDER` | `ALL PHYSICAL WELCOME GIFTS SHIP WITH YOUR FIRST ORDER · DIGITAL GUIDE BY EMAIL` |
| Hero microcopy | `BUY 2, GET 1 FREE · …` | `3 BOTTLES FOR THE PRICE OF 2 · …` |
| Hero media tag | `FIRST ORDER` / `BUY 2, GET 1 FREE` | `90-DAY PLAN` / `3 FOR THE PRICE OF 2` |
| Sticky bar | `90-DAY WELCOME OFFER · BUY 2, GET 1 FREE` | `90-DAY PLAN · 3 BOTTLES FOR THE PRICE OF 2` |
| Section subtitle | `…with Month 3 free.` | `…get 3 bottles for the price of 2 on every shipment.` |
| 90-day ribbon | `BEST VALUE · BUY 2, GET 1 FREE` | `BEST VALUE · 3 BOTTLES FOR THE PRICE OF 2` |
| 90-day ✓ row 2 | `Month 3 is FREE on your first order` | `3 bottles for the price of 2, on every 90-day shipment` |
| 90-day ✓ row 3 | `Complete Welcome Kit included` | `Complete Welcome Kit with your first shipment` |
| 90-day perk 1 | `$39.33/month on your first order` | `$39.33/month at the 90-day subscriber rate` |
| 90-day perk 2 | `You save $59 today` | `Save $59 every 90-day shipment compared with three monthly shipments.` |
| 90-day perk 4 | `You'll pay $118 today. Your next charge is $118 in 90 days…` | `Your 90-day subscription renews at the same $118 subscriber rate every 90 days unless you skip, pause or cancel before renewal. Welcome gifts are included only with your first shipment.` |
| Monthly ✓ row 2 | `Starter Welcome Kit included` | `Starter Welcome Kit with your first shipment` |
| FAQ 4 | `WHY IS MONTH 3 FREE?` | `WHY IS THE 90-DAY PLAN THE BEST VALUE?` (approved answer) |
| FAQ 6 | `…charged at the introductory price…` | `…charged at the $118 subscriber rate…` |
| FAQ 7 | `…through your subscription portal or by contacting support…` | `To change or cancel a future renewal, contact UP MEN support before your next billing date.` |
| Gift list, guide row | `UP MEN Men's Wellness Guide (Digital)` | `UP MEN Men's Wellness Guide (Digital — delivered by email)` |
| 90-day gift order | Bottle, Band, Pack, Keychain | Bottle, Pack, Keychain, Band — matches image slot order |

No urgency, scarcity or deadline wording remains anywhere in the offer.

### Schema fix found by the real push

Shopify's server-side validator rejects `"default": ""` on a text setting
(`Invalid schema: setting with id="note" default cannot be blank`). Eleven such
defaults were introduced in round 1 and blocked the theme upload. The `default`
key was removed rather than emptied, in `hero.liquid` (2), `how-it-works.liquid` (1),
`pricing.liquid` (6) and `reviews.liquid` (2). Theme Check does not catch this —
only a real push does.

### Git flow executed

```
A  cro/up-men-offer-copy-alignment   20ebde7  chore: checkpoint offer copy before live theme sync   (local)
B  sync/live-theme-2026-08-08        from origin/main @ 0d64fe3
C  shopify theme pull --store a7awe0-3u.myshopify.com --live --nodelete
D  sync/live-theme-2026-08-08        b980419  chore: sync published Shopify theme                   (local, empty)
E  cro/up-men-offer-copy-alignment-v2  from b980419
F  git cherry-pick 20ebde7  ->  3 conflicts
G  resolved (below)
H  QA re-run
I  no push
J  no publish
```

Conflicts and how they were resolved:

| File | Resolution |
|---|---|
| `templates/index.json` | Key-level three-way merge. Published version is the base; only keys the checkpoint deliberately changed (`mine != base`) were re-applied. 74 settings re-applied across 10 sections. `facility_8RXmCa` and the 17-section `order` preserved. `hero.media_enabled` and `pricing.offer_enabled` kept at the published `true`. `pricing.blocks` replaced wholesale with the approved 32-block set — the editor's only block change was `"disabled": true` on the two gift rows that the approved list drops anyway. |
| `sections/header-group.json` | Published version taken, then the six approved values re-applied by hand. |
| `templates/page.about.json` | Published version taken (it had been substantially reworked in the editor), then two approved changes re-applied: the ingredient stat `8` → `9`, and the guarantee text. A third banned string found only in the published version — `90-DAY HIGHER-T GUARANTEE` in the guarantee badge — was also fixed. |

Everything else auto-merged: all `sections/*.liquid`, both snippets, `config/settings_data.json`, the docs and the asset deletions.

### QA, round 2

| Check | Result |
|---|---|
| Theme Check vs `b980419` | 72 offenses on both. **PRE-EXISTING THEME CHECK ISSUES: 72 / NEW ISSUES INTRODUCED: 0** |
| JSON validity | 19 JSON files + 44 section schemas parse |
| Real theme push | Succeeded after the empty-default fix |
| Preview render | Verified against fetched HTML from the unpublished theme |
| 90-day form | `id=55350470902051` + `selling_plan=9573695779` |
| Monthly form | `id=55350471033123` + `selling_plan=9574056227` — the fix, confirmed in a real Shopify render |
| Price display | `$118.00 TODAY` / `$59.00 TODAY`, both dynamic |
| Gift strip | 0 tiles rendered — correctly gated off pending assets |
| Sections | 17, `facility_8RXmCa` intact |
| Countdown | No `data-countdown-block` in the offer header; static box in its place |
| Banned strings | none, except the two noted in section 15 |
| Checkout | **not exercised** — needs authorisation, see below |

### Checkout test — not run

Item 10 asks for a checkout test, and also says not to create a real order without
authorisation. Every available route creates one:

- Shopify's Bogus Gateway must be switched on in Admin → Settings → Payments, which
  changes live payment configuration.
- A real controlled order charges a real card and must be refunded and the
  subscription contract cancelled afterwards.
- There is no read-only way to observe checkout's recurring-billing panel.

Cart-level evidence is as strong as it gets without an order: both line items carry
`selling_plan_allocation` with `recurring_deliveries: true`, the correct frequency
option, and `per_delivery_price` matching the displayed price.

Say which route you want and it can be run against the preview theme.
