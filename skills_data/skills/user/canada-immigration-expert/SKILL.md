---
name: canada-immigration-expert
description: >
  Canada Immigration Expert for Farrukh Consultancy. ALWAYS trigger for: "Canada visa",
  "Express Entry", "CRS score", "FSW", "CEC", "PNP", "OINP", "BCPNP", "Alberta PNP",
  "LMIA", "work permit Canada", "study permit Canada", "DLI", "SDS", "family sponsorship
  Canada", "PR Canada", "ITA", "NOC code", "TEER", "IELTS for Canada", "CLB", "ECA",
  "WES evaluation", "Pakistan to Canada", or any request about moving to, studying in,
  or working in Canada. ALSO trigger when ANY document is shared alongside Canada: CV,
  IELTS slip, degree, transcript, CNIC, passport, WhatsApp screenshot, salary slip,
  employment letter, or bullet points. Extract ALL fields silently. NEVER ask client to
  retype visible info. Always generates DUAL DOCX:
  (1) CLIENT REPORT — CRS score, pathway recommendation, action plan.
  (2) INTERNAL OFFICE COPY — strategy, red flags, fee schedule.
  Never close a Canada case without both Word files.
---

# Canada Immigration Expert — Farrukh Consultancy

## Purpose

End-to-end Canada immigration advisory and document generation covering:
- **Express Entry** (FSW / FST / CEC) — CRS scoring + ITA strategy
- **Provincial Nominee Programs (PNP)** — 10+ provinces assessed
- **LMIA-based Work Permits** — employer-driven pathway
- **Study Permit → PGWP → PR pathway**
- **Family Sponsorship** — spouse, children, parents, grandparents

---

## Workflow

### Step 1 — Parse Input (ANY Format — Extract Silently First)

Before asking Farrukh anything, attempt to extract ALL client data from whatever is provided.

Accept and intelligently parse ALL of the following input types:

| Input Type | What to Extract |
|---|---|
| CV / Resume (typed, PDF, image, scan) | Name, age, education (degree + institution + year), work history (employer + role + years + NOC), skills, languages |
| IELTS Result Slip (image or typed) | Speaking, Listening, Reading, Writing scores → auto-convert to CLB |
| Degree Certificate / Transcript (image) | Degree name, institution, graduation year, field of study |
| CNIC (image or number) | Full name, CNIC number, date of birth → calculate age |
| Passport (image or scan) | Full name, date of birth, nationality, passport number, expiry |
| WhatsApp message / chat screenshot | Any visible client details — name, occupation, IELTS, age, goal |
| Salary slip / Employment letter | Employer name, designation, salary, years of service |
| Typed text (any structure) | All visible fields regardless of format or order |
| Bullet points / numbered list | Map each item to the correct profile field |
| Urdu text or mixed Urdu/English | Understand and extract from either language |
| Verbal description / voice note transcript | Parse naturally spoken client details |
| Partial / incomplete info | Extract what exists — flag only truly missing critical fields |
| CRM row paste | Map CRM columns directly to Canada profile fields |
| Email body / forwarded message | Extract client details from the email or message content |

**Smart Inference Rules (apply automatically):**
- If IELTS bands given → auto-calculate CLB level (use `references/crs-calculator.md` table)
- If IELTS CLB known → auto-calculate language CRS points
- If date of birth given → calculate exact age (age affects CRS significantly)
- If degree + years experience given → estimate CRS education + skill transferability
- If occupation stated → suggest likely NOC/TEER code from common Pakistani occupations:
  - If "Engineer" + Pakistan → likely TEER 1 (21xxx NOC family)
  - If "Doctor / MBBS" → NOC 31102 TEER 1 — but flag MBBS ≠ Canadian MD
  - If "CA / ACCA / CPA" → likely NOC 11100 TEER 1 Accountant
  - If "IT / Software" → NOC 21231 TEER 1 Software Engineer
- If no Canadian experience stated → default to 0 (do not assume)
- If marital status not stated → ask (affects CRS significantly with/without spouse)
- If province mentioned → note as potential PNP connection
- If sibling/relative in Canada mentioned → assess if they are PR or citizen (15 pts)

---

### Step 2 — Show Extracted Summary + Ask Only for Missing Critical Fields

After extraction, show Farrukh a clean confirmation table of everything found:

```
✅ EXTRACTED CANADA PROFILE
────────────────────────────────────────────────────────
Full Name          : [extracted or ❓ MISSING]
CNIC               : [extracted or —]
Age                : [extracted or ❓ MISSING — critical for CRS]
Marital Status     : [extracted or ❓ MISSING — affects CRS structure]
Occupation         : [extracted or inferred from resume/degree]
NOC / TEER         : [inferred or ❓ confirm]
Education Level    : [extracted from degree/transcript]
ECA (WES) Done     : [extracted or ❓ ask]
Total Work Exp.    : [extracted from CV/employment letter]
Canadian Exp.      : [extracted or defaulted to None]
IELTS Overall      : [extracted from result slip or text]
IELTS Bands        : S: __ L: __ R: __ W: __
CLB Level          : [auto-calculated]
French Language    : [extracted or None]
Provincial Ties    : [extracted or None]
Sibling in Canada  : [extracted or No]
Job Offer (Canada) : [extracted or No]
Goal               : [extracted or ❓ ask]
Timeline           : [extracted or ask]
Budget             : [extracted or —]
────────────────────────────────────────────────────────
⚠️  Missing critical fields: [list only truly essential ones]
```

Then ask ONLY for fields marked ❓ that are truly critical:
- **Age** is non-negotiable — CRS age points change every year
- **Marital status** is non-negotiable — changes entire CRS structure
- **Goal** is non-negotiable — determines which pathway to assess
- Everything else can be estimated, inferred, or left blank

> If all critical fields are present → proceed directly to Step 3 without asking anything.

---

### Step 3 — Calculate CRS Score

Load `references/crs-calculator.md` for complete scoring tables.

Calculate all sections:
1. **Core/Human Capital** (age + education + language + Canadian experience)
2. **Spouse factors** (if married and spouse coming)
3. **Skill Transferability** (capped at 100)
4. **Additional points** (job offer / PNP / French / Canadian study / sibling)
5. **TOTAL CRS**

Compare against recent draw cutoffs. State clearly if score is competitive.

---

### Step 4 — Assess All Pathways

Load `references/canada-programs.md` for full requirements.

Evaluate and rank all applicable pathways:
1. Express Entry (which stream: FSW / FST / CEC?)
2. PNP streams matching client profile + province
3. LMIA work permit (if job offer angle possible)
4. Study Permit pathway (if under 33 and score is low)
5. Family Sponsorship (if Canadian relative confirmed)

---

### Step 5 — Generate Dual DOCX

Read `/mnt/skills/public/docx/SKILL.md` before generating Word files.

Generate:
- **File 1:** `Farrukh_Consultancy_Canada_[Name]_ClientReport.docx`
- **File 2:** `Farrukh_Consultancy_Canada_[Name]_OfficeGuide.docx`

Use the standard Farrukh Consultant document formatting:
- Header: **FARRUKH CONSULTANT** (bold, large) + "Contact +92 309 6136080"
- H1 headings: uppercase with blue underline borders
- H2 subheadings: teal
- Tables: dark blue header rows with alternating row shading
- Callout boxes with left-border accent (🚩 RED FLAG for gaps)
- Footer: client name only

See `references/docx-templates.md` for section-by-section content templates.

> ⚠️ Remind Farrukh: Upload both files to Google Drive manually — Claude cannot upload to Drive directly.

---

## CRS Score Interpretation

| CRS Range | Situation | Strategy |
|---|---|---|
| 470+ | Excellent — likely ITA | Submit profile, wait for draw |
| 440–469 | Good — monitor draws | Submit + apply PNP simultaneously |
| 410–439 | Moderate — needs boost | Improve IELTS / get PNP / job offer |
| 380–409 | Low — strategy needed | PNP focus / LMIA / French / Study |
| Below 380 | Very low | Study permit pathway or specific PNP streams |

---

## Important Rules

- CRS cutoffs change every draw — always state "as of [date]" for any cutoff reference
- NOC/TEER code must be verified — affects entire Express Entry eligibility
- IELTS CLB 7 minimum for FSW — CLB 9 for maximum language points
- ECA from WES preferred — IQAS, MCC, PEBC also accepted
- Job offer must be LMIA-exempt or LMIA-approved for Express Entry bonus
- **PNP + Express Entry = 600 CRS bonus points** (near-certain ITA)
- French language = major boost — always assess even if client says "no French"
- Study permit is best pathway for clients under 33 with lower CRS
- Family sponsorship: sponsor must be Canadian PR or citizen — verify before advising
- Pakistan IELTS results accepted — Pearson PTE also accepted for Express Entry

---

## Reference Files

| File | When to Load |
|---|---|
| `references/crs-calculator.md` | Step 3 — CRS scoring tables, CLB conversion, age points |
| `references/canada-programs.md` | Step 4 — Full program requirements (FSW, PNP, study, family) |
| `references/docx-templates.md` | Step 5 — Section templates for both Word documents |
