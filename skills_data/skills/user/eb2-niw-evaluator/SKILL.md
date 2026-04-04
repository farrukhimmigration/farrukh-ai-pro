---
name: eb2-niw-evaluator
description: >
  Evaluates a resume or CV for EB-2 National Interest Waiver (NIW) I-140 petition eligibility.
  Use this skill whenever a user uploads a resume/CV and asks about EB-2 NIW chances, success rate,
  eligibility, qualification, immigration petition, green card self-petition, national interest waiver,
  Dhanasar framework analysis, or requests an I-140 petition draft. Triggers on any request to
  evaluate, analyze, score, or assess a resume for EB-2 NIW, and also when asked to produce a
  professional I-140 petition letter or immigration petition document in PDF format.
  Always use this skill when the user mentions EB-2, NIW, national interest waiver, I-140,
  USCIS petition, or green card eligibility assessment from a resume.
---

# EB-2 NIW Resume Evaluator & I-140 Petition Drafter

## Overview

This skill evaluates a resume against the **Matter of Dhanasar (2016)** three-prong framework,
USCIS Policy Manual (Volume 6, Part F, Chapter 5), AAO precedent decisions, INA §203(b)(2)(B)(i),
and 8 CFR §204.5. It produces:
1. A **detailed evaluation report** with prong-by-prong scoring and an overall success percentage
2. A **professional I-140 NIW Petition letter** in PDF format

---

## Step 1: Parse the Resume

Extract the following from the uploaded resume:
- Full name and nationality/country of birth
- Highest degree(s) obtained, institution, field, year
- Current occupation / proposed endeavor
- Years of experience
- Publications, citations, h-index, patents
- Awards, recognition, honors
- Media coverage, press mentions
- Memberships in professional associations
- Evidence of judging/reviewing work of others (peer review, panels)
- Salary/remuneration vs. peers
- Letters of recommendation or reference indicators
- Entrepreneurial activity, startups, products launched
- Government or institutional affiliations
- Any prior U.S. presence, visa history

---

## Step 2: Threshold EB-2 Eligibility Check (Pre-Dhanasar)

Before scoring the three prongs, confirm:

| Requirement | Check |
|---|---|
| Advanced degree (U.S. master's or higher, or foreign equivalent) OR exceptional ability in sciences, arts, or business | ✅ / ❌ / ⚠️ |
| Proposed occupation is a recognized "profession" requiring at least a bachelor's degree | ✅ / ❌ / ⚠️ |
| Self-petition is appropriate (no employer sponsor needed for NIW) | ✅ |

If the threshold is not met, the petition cannot proceed — flag this prominently.

---

## Step 3: Dhanasar Three-Prong Analysis

Score each prong on a **0–100 scale** with sub-criteria weighting. Be STRICT.
A "likely approval" requires all three prongs to score ≥ 60. Strong cases score ≥ 75 on each.

---

### PRONG 1 — Substantial Merit & National Importance (Weight: 30%)

**What USCIS looks for:** The *proposed endeavor* (not just the occupation) must have:
- **Substantial merit**: Inherent value in fields such as STEM, health, education, business, culture, entrepreneurship
- **National importance**: Prospective impact beyond local/personal benefit; aligns with U.S. national priorities

**Sub-criteria scoring (each 0–25):**
1. **Field significance**: Is the field itself recognized as nationally important? (STEM, AI, healthcare, energy, national security = high; general business/arts = moderate; niche/unclear = low)
2. **Specificity of endeavor**: Is the proposed endeavor clearly defined and distinct from generic job duties?
3. **Impact scope**: Does evidence show potential to benefit a broad population, industry, or policy area?
4. **Alignment with national priorities**: Does the endeavor align with Executive Orders, federal agency priorities, legislation, or USCIS-recognized areas (e.g., AI EO Oct 2023, STEM priorities, healthcare)?

**Evidence indicators to look for:**
- Publications and citations addressing U.S. challenges
- Patents addressing market needs
- Projects/products with U.S. deployment or impact
- Government grants, NIH/NSF/DOE funding
- Industry reports citing the field as critical
- Reference to national shortages or crises the work addresses

**Prong 1 Score: [X]/100**

---

### PRONG 2 — Well Positioned to Advance the Endeavor (Weight: 35%)

**What USCIS looks for:** The petitioner's credentials, track record, and plan must show they are
realistically able to make the proposed contributions.

**Sub-criteria scoring (each 0–20):**
1. **Education & training**: Advanced degree directly relevant to endeavor (PhD in relevant field = 20; Master's = 15; Bachelor's with experience = 10; unrelated = 5)
2. **Record of prior success**: Measurable achievements — publications, citations, patents, successful projects, products shipped, companies founded
3. **Recognition by peers/industry**: Awards, invitations to peer review, speaking at conferences, media coverage, top salary
4. **Plan for future activities**: Is there a clear, credible plan described or inferable for U.S.-based work?
5. **Unique skills/knowledge**: Does the petitioner have distinguishing expertise that sets them apart from typical practitioners?

**Evidence indicators:**
- H-index, citation count (field-normalized)
- Named inventor on patents
- Press/media coverage
- Expert testimony, government consulting
- Leadership roles in professional organizations
- Mentorship of others in the field
- Salary in top percentile

**Prong 2 Score: [X]/100**

---

### PRONG 3 — Beneficial to U.S. to Waive Labor Certification (Weight: 35%)

**What USCIS looks for:** A balancing test — does the national benefit of this person's contributions
*outweigh* the traditional protections afforded by the PERM labor certification process?

**Sub-criteria scoring (each 0–25):**
1. **Impracticality of labor certification**: Would PERM be counterproductive or impossible? (e.g., self-employed entrepreneur, researcher with no employer, highly specialized role)
2. **U.S. benefit even if others available**: Is the petitioner's contribution unique enough that the U.S. benefits even if some U.S. workers could theoretically do the work?
3. **Urgency**: Is there a time-sensitive or critical national need that the petitioner addresses? (public health, national security, infrastructure)
4. **Unique qualifications beyond minimum requirements**: Does the petitioner exceed what any job posting for this occupation could capture?

**Prong 3 Score: [X]/100**

---

## Step 4: Calculate Overall NIW Success Probability

```
Weighted Score = (Prong1 × 0.30) + (Prong2 × 0.35) + (Prong3 × 0.35)

Adjust for:
+5%   STEM field with PhD
+5%   More than 20 peer-reviewed publications
+5%   High-impact citations (top 10% in field)
+5%   Government grants or official recognition
+5%   Prior NIW-relevant media/press coverage
-10%  No advanced degree (exceptional ability track must be proven)
-10%  Proposed endeavor is vague or matches generic job description
-10%  No evidence of national impact or recognition outside employer
-15%  Field has low national importance (subjective arts without national recognition)
-5%   Weak or absent future plan in the U.S.

Final Success Probability = Weighted Score + Adjustments (capped at 95%, floor at 5%)
```

**Interpretation bands:**
| Score | Interpretation |
|---|---|
| 85–95% | **Very Strong** – High likelihood of approval; proceed with petition |
| 70–84% | **Strong** – Good case; strengthen weak prong before filing |
| 55–69% | **Moderate** – Plausible but needs significant evidence strengthening |
| 40–54% | **Borderline** – Considerable risk; recommend consulting an immigration attorney |
| < 40%  | **Weak** – Not ready to file; major gaps in eligibility |

---

## Step 5: Detailed Report Output Format

Structure the evaluation report as follows:

```
[HEADER]
EB-2 NIW ELIGIBILITY EVALUATION REPORT
Prepared by: Farrukh Consultancy
Prepared pursuant to Matter of Dhanasar, 26 I&N Dec. 884 (AAO 2016)
USCIS Policy Manual, Volume 6, Part F, Chapter 5
INA §203(b)(2)(B)(i) | 8 CFR §204.5(k)

[EXECUTIVE SUMMARY]
- Petitioner name and field
- Overall Success Probability: XX%
- Recommendation: Proceed / Strengthen First / Consult Attorney / Not Ready

[THRESHOLD EB-2 ELIGIBILITY]
- Degree check
- Occupation/profession check
- Result

[PRONG-BY-PRONG ANALYSIS]
Prong 1: [Score/100] – Substantial Merit & National Importance
  - Strengths
  - Weaknesses
  - Evidence present / missing

Prong 2: [Score/100] – Well Positioned to Advance
  - Strengths
  - Weaknesses
  - Evidence present / missing

Prong 3: [Score/100] – Beneficial to Waive Labor Certification
  - Strengths
  - Weaknesses
  - Evidence present / missing

[WEIGHTED SCORE CALCULATION]
[ADJUSTMENT FACTORS]
[FINAL SUCCESS PROBABILITY]

[KEY STRENGTHS OF THIS CASE]
[CRITICAL GAPS & RECOMMENDATIONS]
[COMPARABLE APPROVED CASES] (cite relevant AAO decisions if applicable)
```

---

## Step 6: Generate the PDF Evaluation Report

Use the saved pattern in `scripts/generate_report.py` to produce the PDF. This script
contains all branding, styles, colours, and layout logic — do not rewrite it from scratch.

**How to use it:**
1. Read `scripts/generate_report.py` to understand the `build_report()` function signature.
2. Populate all section content (threshold rows, prong rows, gaps, strengths, cases) as
   `Paragraph` objects using the styles defined in the script (`ch`, `cn`, `cnr`, etc.).
   Never use plain strings in table cells — always use `Paragraph(text, style)`.
3. Call `build_report(...)` with the populated data.
4. Output the PDF to `/mnt/user-data/outputs/<PetitionerName>_EB2_NIW_Evaluation.pdf`.

**Strict page-break pattern (always follow):**
- Page 1  → Logo + Report Title + Metadata
- Page 2  → Executive Summary
- Page 3  → Threshold EB-2 Eligibility Check
- Page 4  → Prong 1 Analysis
- Page 5  → Prong 2 Analysis
- Page 6  → Prong 3 Analysis
- Page 7  → Weighted Score Calculation & Final Probability
- Page 8  → Key Strengths
- Page 9  → Critical Gaps & Strengthening Roadmap
- Page 10 → Comparable AAO Decisions

**Key rules:**
- Every new section starts on a fresh page (`PageBreak()` is built into `prong_section()`
  and must be added manually before all other sections).
- Logo path: `assets/farrukh_logo.png`
- No disclaimer, no AI attribution anywhere in the output.
- Footer: "Farrukh Consultancy | Immigration & Visa Consultancy Experts | Lahore, Pakistan"

## Step 7: Draft the I-140 NIW Petition Letter

After the evaluation report, generate a **professional I-140 petition cover letter** as a
separate PDF. Read `/mnt/skills/public/pdf/SKILL.md` for PDF generation guidance.

The petition letter must be presented on **Farrukh Consultancy** letterhead — embed the
logo from `assets/farrukh_logo.png` as a full-width banner at the very top of the PDF,
followed by the letter content. Do not reference AI or any automated tool in the letter.

The petition letter must include:

1. **Header**: USCIS Service Center address, date, RE: Form I-140, Immigrant Petition for Alien Workers – EB-2 National Interest Waiver
2. **Introduction**: Petitioner identity, EB-2 category claimed, NIW request
3. **Threshold EB-2 Eligibility**: Cite degree, institution, field; cite 8 CFR §204.5(k)(2) or (k)(3)
4. **Proposed Endeavor Section**: Clear, specific description of U.S.-based proposed work
5. **Prong 1 Argument**: Substantial merit + national importance, with evidence citations
6. **Prong 2 Argument**: Well positioned — qualifications, track record, plan
7. **Prong 3 Argument**: Balance of factors favoring waiver
8. **Conclusion & Prayer for Relief**: Request for approval, list of exhibits
9. **Exhibit List**: A – Degree certificates; B – CV; C – Publications list; D – Citation evidence; E – Awards; F – Letters of support; G – Evidence of national impact
10. **Signature block**: "[Petitioner Name], Pro Se" (or attorney if applicable)

**Tone**: Formal legal writing. Use persuasive but factual language. Cite specific evidence
from the resume throughout. Avoid vague claims. Reference Matter of Dhanasar and USCIS Policy
Manual explicitly.

**Length**: 8–15 pages is typical for a strong NIW cover letter.

---

## Branding & Attribution

All reports and petition letters must be presented as prepared by **Farrukh Consultancy**.
- The Farrukh Consultancy logo is located at `assets/farrukh_logo.png` — embed it at the top of every PDF output (evaluation report and petition letter) as a full-width header banner.
- Below the logo, include "Prepared by: Farrukh Consultancy" in the report header.
- Do NOT include any disclaimer section in the report or petition letter.
- Do NOT reference AI, artificial intelligence, or any automated system anywhere in the output.
- The tone and presentation should reflect a professional consultancy firm.

---

## Reference Files & Scripts

- `scripts/generate_report.py` — **Primary PDF generation script.** Contains all branding,
  styles, colours, layout helpers, and the `build_report()` function. Always use this to
  produce evaluation report PDFs. Read it before generating any report.
- `references/dhanasar-prongs-detail.md` — Detailed breakdown of each prong with AAO case citations
- `references/i140-petition-template.md` — Full I-140 cover letter template
- `assets/farrukh_logo.png` — Farrukh Consultancy logo for all PDF headers
