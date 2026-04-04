---
name: australia-482-job-manager
description: >
  Fully automated multi-client job application manager for Pakistani clients seeking Australian
  Class 482 (Temporary Skill Shortage) visa sponsorship. Use this skill whenever a user provides
  client profiles (in any format) and wants help with Australian job applications, resume creation,
  visa-sponsored job searching, cover letters, or email drafts. Also trigger when the user mentions
  482 visa, TSS visa, Australian job market, client resumes, job matching, or asks to manage
  multiple applicants at once. Always activate for any request involving Australian work visa
  sponsorship, even if only one client is mentioned. This skill handles everything: parsing client
  data, creating organized folder structures, generating professional PDFs and DOCX files, live web
  searching for 482-sponsored roles, and preparing application materials.
---

# Australia Class 482 Multi-Client Job Application Manager

## Overview

This skill manages the complete job application lifecycle for Pakistani clients seeking Class 482
(Temporary Skill Shortage) visa sponsorship in Australia. It handles any number of clients,
produces all required files, and uses live web search to find real, current job opportunities.

---

## Step 0: Read Dependency Skills First

Before producing any output files, read these skills:
- **Resume PDF**: `/mnt/skills/public/pdf/SKILL.md` — for generating resume PDFs with reportlab
- **Cover Letters**: `/mnt/skills/public/docx/SKILL.md` — for generating .docx cover letters
- **Job Matches**: `/mnt/skills/public/xlsx/SKILL.md` — for generating .xlsx job tracker

---

## Step 1: Parse Client Profiles

Accept client data in **any format**: plain text, pasted CV, uploaded PDF/DOCX, bullet points,
or unstructured notes. Extract the following fields for each client (mark as "MISSING" if absent):

| Field | Notes |
|---|---|
| Full Name | First + Last |
| Contact | Phone, email, LinkedIn |
| Location (Pakistan) | City |
| Target Location (AU) | State/city preference if mentioned |
| Education | Degree, institution, year |
| Work Experience | Roles, companies, dates, responsibilities |
| Skills | Technical + soft skills |
| Certifications | Name, issuer, year |
| Industry/Occupation | Primary field |
| ANZSCO Code | Look up if not provided (see Step 2) |
| Languages | English level + other languages |
| Visa Status | Current status, any prior AU applications |

**Multi-client handling**: If the user provides multiple clients in one message, process each
separately and label outputs clearly. Assign sequential IDs: 001, 002, 003, etc.

---

## Step 2: ANZSCO Verification & 482 Eligibility

Before searching for jobs, verify the client's occupation is on the 482 visa eligible list.

### Search for eligibility:
```
web_search: "ANZSCO [occupation] 482 visa eligible 2024 Australia"
web_search: "Short-term skilled occupation list OR medium-long-term strategic skills list [occupation]"
```

Key lists to check:
- **MLTSSL** (Medium and Long-Term Strategic Skills List) — preferred, longer stay
- **STSOL** (Short-Term Skilled Occupation List) — 2-year visa
- **ROL** (Regional Occupation List) — regional sponsorship only

Note the list in the Discrepancy Note and Job Matches sheet. Flag occupations NOT on any list.

---

## Step 3: File & Folder Structure

Create this structure for each client:

```
Client_[FirstName]_[LastName]_[ID]/
├── [FirstName][LastName]_Resume.pdf
├── [FirstName][LastName]_Discrepancy_Note.txt
├── [FirstName][LastName]_Job_Matches.xlsx
├── cover_letters/
│   └── [FirstName][LastName]_CoverLetter_[JobTitle]_[Company].docx
└── email_drafts/
    └── [FirstName][LastName]_GmailDraft_[JobTitle]_[Company].txt
```

**Naming rules:**
- No spaces in filenames — use CamelCase
- Job title in filenames: shorten to max 3 words, remove special characters
- Company in filenames: remove Pty Ltd, spaces → camel (e.g., `AnsellLimited`)

---

## Step 4: Resume PDF Generation

Use `reportlab` (from the PDF skill) to generate a professional Australian-style resume.

### Australian Resume Standards:
- **No photo**, no date of birth, no marital status (Australian norm)
- Max 3 pages (2 preferred for <10 years experience)
- Reverse chronological order
- Use action verbs: "Led", "Developed", "Managed", "Implemented"
- Quantify achievements where possible: "Reduced costs by 20%", "Managed team of 8"
- Include: Summary Statement, Skills, Work Experience, Education, Certifications, References available on request

### PDF Layout (reportlab):

```python
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable, Table, TableStyle
from reportlab.lib.units import cm

# Color palette — professional Australian style
NAVY = colors.HexColor("#1B3A6B")
LIGHT_GRAY = colors.HexColor("#F5F5F5")
MID_GRAY = colors.HexColor("#666666")

doc = SimpleDocTemplate(
    "ClientName_Resume.pdf",
    pagesize=A4,
    topMargin=1.5*cm,
    bottomMargin=1.5*cm,
    leftMargin=2*cm,
    rightMargin=2*cm
)
```

### Sections to include in order:
1. **Header**: Name (large, navy bold), title/profession, phone | email | LinkedIn | Location (AU target)
2. **Professional Summary**: 3–4 sentences tailored to Australian employers
3. **Core Skills**: 2-column grid of 8–12 skills
4. **Work Experience**: Company | Role | Dates | Bullet achievements
5. **Education**: Degree | Institution | Year (include CGPA if strong)
6. **Certifications**: Name | Issuer | Year
7. **References**: "Available upon request"

---

## Step 5: Discrepancy Note

Create `[Name]_Discrepancy_Note.txt` listing:

```
CLIENT: [Full Name] | ID: [001]
Generated: [Date]

MISSING INFORMATION:
- [Field]: Not provided — recommend client supplies this
- ...

INCONSISTENCIES:
- [Issue]: e.g., gap in employment 2019–2021 unexplained
- ...

VISA ELIGIBILITY FLAGS:
- Occupation "[X]" is on [MLTSSL/STSOL/Not Listed]
- Recommend [action if not listed]

PROFILE ENHANCEMENT SUGGESTIONS:
- Obtain [Certification] to strengthen 482 eligibility
- Add LinkedIn URL
- ...
```

---

## Step 6: Live Job Search (Web Search)

Search for real, current jobs matching the client's skills and 482 eligibility.

### Search strategy — run ALL of these:

```
web_search: "[occupation] jobs Australia 482 visa sponsorship [year]"
web_search: "[occupation] jobs Australia "visa sponsorship" site:seek.com.au"
web_search: "[occupation] "employer sponsored" jobs Australia [state if preferred]"
web_search: "seek.com.au [ANZSCO occupation] sponsorship available"
web_search: "indeed.com.au [occupation] visa sponsorship"
web_search: "[occupation] jobs Australia linkedin.com visa sponsor"
```

### For each job found, extract:
| Column | Description |
|---|---|
| Job Title | Exact title |
| Company | Employer name |
| Location | City, State |
| Link | Direct job URL |
| Visa Info | "482 Sponsor", "Employer Sponsored", "Visa Support" etc. |
| Date Added | Today's date |
| Status | "Not Applied" (default) |
| Salary Range | If mentioned |
| Notes | Key requirements, closing date |

---

## Step 7: Job Matches Excel File

Use `openpyxl` (from the XLSX skill) to create the tracker.

```python
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side

wb = Workbook()
ws = wb.active
ws.title = "Job Matches"

# Header row — navy background, white bold text
headers = ["Job Title","Company","Location","Link","Visa Info","Date Added","Status","Salary Range","Notes"]
header_fill = PatternFill("solid", fgColor="1B3A6B")
header_font = Font(bold=True, color="FFFFFF", name="Arial")

for col, header in enumerate(headers, 1):
    cell = ws.cell(row=1, column=col, value=header)
    cell.fill = header_fill
    cell.font = header_font
    cell.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)

# Status dropdown hint in Notes
ws.row_dimensions[1].height = 30

# Column widths
widths = [25, 22, 18, 40, 18, 14, 14, 16, 35]
for i, w in enumerate(widths, 1):
    ws.column_dimensions[ws.cell(1, i).column_letter].width = w

# Freeze header row
ws.freeze_panes = "A2"

# Add a Summary sheet
ws2 = wb.create_sheet("Summary")
ws2["A1"] = "Client:"
ws2["B1"] = "[Client Full Name]"
ws2["A2"] = "ANZSCO Code:"
ws2["A3"] = "Visa List:"
ws2["A4"] = "Total Jobs Found:"
ws2["B4"] = f"=COUNTA('Job Matches'!A2:A1000)"
ws2["A5"] = "Applied:"
ws2["B5"] = "=COUNTIF('Job Matches'!G:G,\"Applied\")"
ws2["A6"] = "Interviews:"
ws2["B6"] = "=COUNTIF('Job Matches'!G:G,\"Interview\")"
ws2["A7"] = "Last Updated:"

wb.save("[ClientName]_Job_Matches.xlsx")
```

Then run: `python scripts/recalc.py [ClientName]_Job_Matches.xlsx`

---

## Step 8: Cover Letters (DOCX)

Use `docx` npm package (from the DOCX skill) to generate tailored cover letters.

One cover letter per strong job match. Personalize each to the company and role.

### Australian Cover Letter Format:
```
[Date]

Hiring Manager
[Company Name]
[Company Address if known]

Re: Application for [Job Title] — [Reference Number if available]

Dear Hiring Manager,

PARAGRAPH 1 — Hook + role name + how you found it (1–2 sentences)

PARAGRAPH 2 — Why you're qualified: highlight 2–3 specific achievements matching the JD.
Quantify where possible. Mention 482 visa sponsorship directly and positively.

PARAGRAPH 3 — Why THIS company: show you've researched them. Connect their work to your goals.

PARAGRAPH 4 — Call to action: request interview, thank them, provide contact details.

Yours sincerely,
[Client Full Name]
[Phone] | [Email] | [LinkedIn]
```

### Filename pattern:
`[ClientName]_CoverLetter_[JobTitle]_[Company].docx`

---

## Step 9: Gmail/Email Drafts (TXT)

For each cover letter, create a plain-text email draft saved as `.txt`.

```
TO: [recruiter email if found, else careers@company.com.au]
SUBJECT: Application – [Job Title] | [Client Name] | Class 482 Visa Eligible

---

Dear [Hiring Manager / Recruiter Name],

I am writing to apply for the [Job Title] position advertised on [Platform].

[2–3 sentence summary of fit and 482 status]

Please find attached my resume and cover letter for your consideration.
I am available for an interview at your convenience.

Kind regards,
[Client Full Name]
[Phone] | [Email] | [LinkedIn]

ATTACHMENTS TO ADD:
- [ClientName]_Resume.pdf
- [ClientName]_CoverLetter_[JobTitle]_[Company].docx
```

---

## Step 10: Final Output Summary

After processing all clients, present a summary table:

```
| Client | ID  | Resume | Jobs Found | Cover Letters | Status |
|--------|-----|--------|------------|---------------|--------|
| Ali Khan | 001 | ✅ | 12 | 3 | Ready |
```

Then present all files using `present_files` tool.

---

## Multi-Client Workflow Checklist

For each client, in order:

- [ ] Parse and extract profile fields
- [ ] Identify ANZSCO code and 482 list eligibility (web search)
- [ ] Create folder structure
- [ ] Write Discrepancy Note
- [ ] Generate Resume PDF
- [ ] Run 6+ web searches for current 482 jobs
- [ ] Create Job Matches XLSX with found roles
- [ ] Write cover letters for top 3–5 matches
- [ ] Write Gmail drafts for same matches
- [ ] Present all output files

---

## Common 482-Eligible Occupations (Quick Reference)

| Occupation | ANZSCO | List |
|---|---|---|
| Software Engineer | 261313 | MLTSSL |
| Accountant (General) | 221111 | MLTSSL |
| Registered Nurse | 254422 | MLTSSL |
| Civil Engineer | 233211 | MLTSSL |
| Electrician | 341111 | MLTSSL |
| Chef | 351311 | STSOL |
| ICT Business Analyst | 261111 | MLTSSL |
| Mechanical Engineer | 233512 | MLTSSL |
| Project Manager (Construction) | 133111 | MLTSSL |
| Network Engineer | 263213 | MLTSSL |

Always verify current eligibility via web search — lists are updated quarterly.

---

## Notes on 482 Visa

- Employer must be an **approved sponsor** — check if the company advertises this
- Minimum salary: **TSMIT (Temporary Skilled Migration Income Threshold)** — currently AUD $70,000+/year; search for current figure
- Skills assessment may be required before visa lodgement
- Occupation must match the nominated ANZSCO code exactly
- Regional sponsors (RSMS) have expanded occupation lists — worth noting for regional roles
