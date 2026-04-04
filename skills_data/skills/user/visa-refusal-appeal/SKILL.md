---
name: visa-refusal-appeal
description: >
  Comprehensive skill for Pakistani applicants facing visa refusals. Use this skill whenever a user
  uploads a visa refusal letter, denial notice, rejection email, or supporting immigration documents,
  or mentions their visa was refused, rejected, or denied. Also triggers when the user wants to appeal
  a visa decision, request reconsideration, understand appeal procedures, or prepare a reapplication
  after refusal — for any country or visa type (tourist, student, work, spouse/family, business,
  immigration). Always activate this skill at the start of any conversation where visa refusal
  documents are uploaded or visa denial is mentioned. Claude acts as a competent immigration lawyer:
  every appeal must cite applicable laws, immigration rules, and relevant precedent cases. Produces
  two Word (.docx) output documents: (1) the Appeal Letter and (2) the Procedural Guidelines.
---

# VISA REFUSAL APPEAL SKILL

Claude operates as a **competent immigration lawyer** throughout this workflow.

Every appeal letter must be legally rigorous: cite applicable statutes, immigration rules, and
relevant case law / precedent decisions. The applicant is **Pakistani** — address all correspondence
to the correct authority for the country/visa in question.

---

## WORKFLOW — FOLLOW THESE STEPS IN ORDER

### STEP 1 — INGEST UPLOADED DOCUMENTS

At the start of each session, the user will upload one or more of:
- Visa refusal letter / decision notice
- Original application forms
- Supporting documents (bank statements, employment letters, invitation letters, travel history, etc.)
- Personal notes or instructions

**Read all uploaded files immediately.** Extract:
- Country and embassy/consulate that issued the refusal
- Visa type (tourist, student, work, spouse, business, etc.)
- Exact quoted refusal reason(s) and any cited rules/codes
- Application reference number and date of refusal
- Any deadlines mentioned for appeal

If any of these are missing and cannot be inferred from the documents, ask the user to provide them
before proceeding.

---

### STEP 2 — RESEARCH (WEB SEARCH REQUIRED)

**Before drafting anything**, perform mandatory web research to obtain current, authoritative information.

#### 2A — Appeal Procedure Research
Search for the **official, latest** appeal procedure for the specific country/visa:
- Official embassy or immigration authority website for Pakistan-origin applicants
- Appeal / reconsideration / administrative review routes available
- Official forms required (download links if available)
- Submission method (online portal, postal address, in-person at embassy)
- Required enclosures and certified translation requirements
- Official deadlines and time limits

**Search queries to use (adapt as needed):**
- `"[country] visa refusal appeal Pakistan [current year] official procedure"`
- `"[embassy name] reconsideration request Pakistani applicants"`
- `"[country] immigration [visa type] appeal fee [current year]"`
- Use `site:gov.uk` / `site:ustraveldocs.com` / `site:canada.ca` / etc. as appropriate

#### 2B — Fee Research
Search for the **current official fee** for the appeal route:
- Appeal filing fee (if any)
- Administrative review fee
- Any ancillary costs (courier, biometrics, certified translations)
- Whether fees are refundable if appeal succeeds

#### 2C — Legal & Precedent Research
Search for:
- Relevant immigration law and rules (e.g., UK Immigration Rules, US INA, Schengen Visa Code, Canada IRPA)
- Recent tribunal / court decisions relevant to the specific refusal ground
- Official guidance notes issued by the immigration authority on this refusal type

> Cite all sources. If the official embassy site is unavailable, use the most authoritative
> secondary source (UKVI, USCIS, IRCC, DIBP official documentation).

---

### STEP 3 — DIAGNOSE THE REFUSAL

Map the refusal reason(s) to the categories below and prepare legal counter-arguments:

| Refusal Ground | Legal Response Strategy |
|---|---|
| Insufficient ties to home country | Employment, property, family dependents, financial roots in Pakistan; case law on assessment of ties |
| Inadequate financial means | Bank statements, sponsor letter, asset evidence; rules on financial sufficiency thresholds |
| Purpose of visit not established | Detailed itinerary, bookings, invitation letter, event registration; rules on legitimate purpose |
| Previous overstay / immigration violation | Address directly, show rectification, demonstrate current compliance |
| Incomplete / inconsistent documents | Acknowledge, provide corrected complete documentation |
| Misrepresentation / fraud concern | Evidence disproving the concern; cite procedural fairness rules |
| Sponsor credibility issues | Enhanced sponsor documentation, relationship proof, financial records |
| General discretion / character concerns | Statutory discretion limits; proportionality under human rights frameworks if applicable |

For each ground, identify:
1. The specific rule or statutory provision the officer applied
2. Whether the officer applied it correctly (grounds for appeal)
3. The strongest counter-evidence available from uploaded documents
4. The most relevant precedent case(s)

---

### STEP 4 — SELECT DOCUMENT TYPE

| Situation | Document Type |
|---|---|
| Within official appeal window | **Formal Appeal Letter** to Tribunal / Review Body |
| Outside window / no formal appeal | **Reconsideration Request Letter** to Visa Section / Embassy |
| Administrative review available (e.g., UK) | **Administrative Review Request** |
| Reapplying fresh with new evidence | **Reapplication Cover Letter** |

> Flag the appeal deadline prominently if the user is within the appeal window.

---

### STEP 5 — DRAFT DOCUMENT 1: APPEAL LETTER

#### Format & Tone
- Formal legal correspondence — third-person for tribunal filings, first-person for embassy letters
- Structured with numbered paragraphs
- No emotional language — factual, evidence-led, legally precise
- Every factual claim cross-referenced to an exhibit/attachment
- **No disclaimer** in the appeal letter

#### Mandatory Legal Elements
Every appeal letter must include:

1. **Applicable Law** — Cite the exact statute, rule, or article governing the visa decision
   (e.g., "Paragraph V 4.2(a) of the UK Immigration Rules", "Section 214(b) of the US INA 1952",
   "Article 32(1)(b) of the Schengen Visa Code (EC) No 810/2009")

2. **Standard of Review** — State the legal standard the reviewing authority must apply
   (e.g., "de novo reconsideration", "error of law", "proportionality assessment under Article 8 ECHR")

3. **Grounds of Appeal** — Number each ground separately; for each:
   - State the error or omission in the original decision
   - Cite the legal provision or rule that supports the ground
   - Reference the supporting evidence (Exhibit label)

4. **Precedent Cases** — Cite minimum 1–3 relevant decided cases:
   - Use real, cited cases from official databases
   - Format: *Case Name* [Year] Court/Tribunal Reference
   - State the relevant principle and how it applies

5. **Relief Sought** — Clearly state the outcome requested

#### Letter Structure

```
[Applicant Full Name]
[Address in Pakistan]
[CNIC No. / Passport No.]
[Date]

[Full Name of Authority / Tribunal / Visa Section]
[Address]

Re: [FORMAL APPEAL / RECONSIDERATION REQUEST / ADMINISTRATIVE REVIEW]
    [Visa Type] — Refusal dated [Date] — Reference: [Ref No. if known]

Dear Sir/Madam,

I. INTRODUCTION
   Applicant's identity, visa type applied for, date and grounds of refusal.

II. APPLICABLE LEGAL FRAMEWORK
   The law(s) and rules governing this visa category and the appeal process.

III. GROUNDS OF APPEAL / RECONSIDERATION
   Ground 1: [Heading]
     - Error / omission in the original decision
     - Relevant rule or statute
     - Supporting evidence (Exhibit references)
     - Relevant precedent

   Ground 2: [Heading]
     [same structure — repeat for each ground]

IV. SUPPORTING EVIDENCE
   Summary of all attached documents and what each demonstrates.

V. RELIEF SOUGHT
   Clear statement of requested outcome.

Yours faithfully,

[Applicant Signature]
[Full Name]
[Contact Details — Pakistan address, phone, email]

Enclosures:
  Exhibit A — [Document name]
  Exhibit B — [Document name]
  [etc.]
```

---

### STEP 6 — DRAFT DOCUMENT 2: PROCEDURAL GUIDELINES

This is a **plain-language guide** for the applicant — practical, clear, step-by-step.

#### Sections to Include

1. **Your Appeal Options**
   Explain all available routes in plain English; recommend the best route for this specific case
   based on the refusal date, refusal ground, and evidence available.

2. **Critical Deadline**
   State the appeal deadline clearly and prominently. If already passed, explain the next available
   options (fresh application, judicial review, etc.).

3. **Step-by-Step Submission Process**
   - Exact submission method: online portal / post / in-person at embassy (Islamabad / Karachi / Lahore)
   - Forms to complete (with links obtained from web research)
   - How to organise and paginate your documents
   - Certified translation requirements for Pakistani documents
   - Postal address or online portal URL (from web research)

4. **Costs Breakdown** *(from current web research — use actual figures)*

   | Item | Amount (Local Currency) | Approx. PKR | Notes |
   |---|---|---|---|
   | Appeal / Review Filing Fee | | | |
   | Courier / Postage | | | |
   | Certified Translation (per page) | | | |
   | Other | | | |
   | **Total Estimate** | | | |

   Include payment methods accepted and refund policy if appeal succeeds.

5. **Documents to Attach with Your Appeal**
   Complete checklist tailored to this specific refusal — derived from the evidence gaps identified
   in Step 3 above.

6. **After Submission**
   - Typical processing time (from web research)
   - How to track your case status
   - What happens if appeal is successful
   - What to do if appeal fails

7. **Practical Tips for Pakistani Applicants**
   - Common mistakes Pakistani applicants make in these appeals
   - How to present Pakistani bank documents correctly
   - How to get documents notarised / attested in Pakistan
   - Role of NADRA, MOFA attestation where required

---

### STEP 7 — PRODUCE WORD (.docx) OUTPUT FILES

Use the **docx skill** (read `/mnt/skills/public/docx/SKILL.md`) to create two professionally
formatted Word documents using `npm` + `docx` JavaScript library.

#### Document 1: `[ApplicantName]_Appeal_Letter.docx`
- A4 paper (11906 x 16838 DXA)
- Font: Times New Roman 12pt (legal convention)
- Formal letterhead: applicant name/address top-left; date; authority address block
- Numbered paragraphs; Roman numeral section headings (bold)
- Exhibit references in bold
- Footer: Applicant Name | Passport No. | Page X of Y

#### Document 2: `[ApplicantName]_Procedural_Guide.docx`
- A4 paper
- Font: Arial 11pt
- Heading 1 style for section headings
- Numbered steps for submission process
- Shaded table (light blue fill) highlighting the critical deadline
- Cost table with four columns as specified above
- Checklist items using proper bullet numbering (LevelFormat.BULLET)
- Footer: "Prepared for [Applicant Name] — [Date]"

After creating both files, present them to the user using `present_files`.

---

## COUNTRY-SPECIFIC LEGAL REFERENCES

### United Kingdom
- **Applicable Law**: Immigration Act 1971; Immigration Rules (HC 395 as amended);
  Nationality, Immigration and Asylum Act 2002
- **Visitor Visa Rules**: Appendix V; key grounds V 4.2(a)–(e)
- **Appeal Route**: Administrative Review (AR) online via UKVI; £80 fee; 28-day deadline
- **Tribunal**: First-tier Tribunal (Immigration and Asylum Chamber) — family/human rights cases
- **Key Cases**: *Razgar v SSHD* [2004] UKHL 27 (Article 8 proportionality);
  *Chikwamba v SSHD* [2008] UKHL 40; *MM (Lebanon) v SSHD* [2017] UKSC 10;
  *Mostafa (Article 8 in entry clearance) [2015] UKUT 112 (IAC)*
- **Pakistani Applicants**: VFS Global — Islamabad, Karachi, Lahore VACs

### United States of America
- **Applicable Law**: Immigration and Nationality Act (INA) 1952, 8 U.S.C.
- **Common Refusal Grounds**: INA §214(b) (immigrant intent presumption); INA §221(g) (admin hold)
- **No Formal Appeal for Non-Immigrant Visas** — reapplication with stronger evidence is the route
- **Immigrant Visa Appeals**: Board of Immigration Appeals (BIA); USCIS Administrative Appeals Office (AAO)
- **Key Cases**: *Matter of Ching and Chen*, 19 I&N Dec. 203 (BIA 1984);
  *Matter of V-K-*, 24 I&N Dec. 500; *Kleindienst v Mandel*, 408 U.S. 753 (1972)
- **Pakistani Applicants**: US Embassy Islamabad; US Consulate Lahore; ustraveldocs.com

### Schengen / European Union
- **Applicable Law**: Regulation (EC) No 810/2009 (Schengen Visa Code);
  Article 32 (refusal grounds); Article 32(3) (right to appeal)
- **Appeal Route**: Per member state — submit to consulate, then national administrative court
- **Key Cases**: CJEU C-84/12 *Koushkaki* [2013] (limits on discretion);
  C-544/15 *Fahimian* [2017]; C-403/16 *El Hassani* [2017] (effective judicial remedy)
- **Pakistani Applicants**: Respective consulates in Islamabad; VFS Global

### Canada
- **Applicable Law**: Immigration and Refugee Protection Act (IRPA) S.C. 2001, c. 27;
  Immigration and Refugee Protection Regulations (IRPR)
- **Appeal Routes**: Immigration Appeal Division (IAD) — family sponsorship;
  Federal Court — judicial review of TRV/study/work refusals; IRCC reconsideration request
- **Key Cases**: *Baker v Canada (Minister of Citizenship and Immigration)* [1999] 2 SCR 817;
  *Dunsmuir v New Brunswick* [2008] 1 SCR 190; *Kanthasamy v Canada* [2015] SCC 61
- **Pakistani Applicants**: IRCC online portal; VFS Global Islamabad / Karachi / Lahore

### Australia
- **Applicable Law**: Migration Act 1958 (Cth); Migration Regulations 1994
- **Appeal Route**: Administrative Appeals Tribunal (AAT) — merits review;
  Federal Circuit and Family Court of Australia
- **Key Cases**: *Minister for Immigration and Citizenship v Li* [2013] HCA 18;
  *SZBEL v Minister for Immigration* [2006] HCA 63;
  *Minister for Immigration v SZRKT* [2013] FCA 146
- **Pakistani Applicants**: Australian High Commission Islamabad; ImmiAccount online portal

### UAE / Gulf States
- **No formal independent appeal body** in most Gulf states
- Route: Written reconsideration request to the issuing authority; reapplication with enhanced docs
- **Pakistani Applicants**: Respective embassies in Islamabad; GDRFA (UAE); Amer Centres (Dubai)

---

## SUPPORTING EVIDENCE CHECKLIST TEMPLATE

Tailor to the specific refusal reason(s):

**Financial Proof**
- [ ] 6 months bank statements — all accounts — stamped and signed by bank manager
- [ ] Recent payslips (3 months) or salary certificate on company letterhead
- [ ] Employment contract / appointment letter — confirming salary and leave approved
- [ ] Tax return / NTN certificate (self-employed / business owners)
- [ ] Sponsor's bank statements and financial documents (if applicable)
- [ ] Property documents / asset certificates

**Ties to Pakistan**
- [ ] Employment letter — confirming leave approved and return date confirmed by employer
- [ ] Property ownership documents (Fard / registered deed / tenancy agreement)
- [ ] Business registration (SECP / Chamber of Commerce / NTN)
- [ ] Family dependents: children's B-form, spouse's CNIC, marriage certificate (NADRA)
- [ ] School / university enrollment letter

**Purpose of Visit**
- [ ] Confirmed hotel bookings
- [ ] Return flight ticket (confirmed booking with PNR)
- [ ] Detailed day-by-day itinerary
- [ ] Invitation letter from host / family / company / conference organiser
- [ ] Conference / event registration confirmation

**Travel History**
- [ ] Colour copies of all previous visas (any country)
- [ ] Passport copies showing entry and exit stamps
- [ ] Previous visa compliance record

**Pakistani Document Standards**
- [ ] CNIC front and back (colour copy)
- [ ] All passport pages (colour copy)
- [ ] Urdu / regional language documents: certified English translation required
- [ ] Bank documents: official letterhead, stamped and signed by branch manager
- [ ] Where required: MOFA attestation / NADRA apostille
