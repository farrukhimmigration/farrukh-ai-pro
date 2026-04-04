---
name: us-conference-invitation-finder
description: >
  Searches for upcoming USA conferences that provide official invitation letters to international attendees — ideal for supporting B1/B2 visa applications for clients from Pakistan. Use this skill whenever a user mentions: finding US conferences for visa letters, conference invitations for B1/B2 visa, USA professional events for Pakistani visitors, searching US conferences for visa support, crafting a conference invitation request email from a client profile, or any request to find USA conferences that can help document genuine professional intent for a US visa. Always trigger this skill when the user says "Invoke US Conference Invitation Finder", "Search for US conferences for visa invitations", "draft invitation email for [client]", or anything semantically similar — including when the user pastes a client's CV, resume, or professional profile and asks for an email to a conference.
---

# US Conference Invitation Finder

A two-stage skill:
- **Stage 1**: Find upcoming USA conferences with invitation letters, tagged by profession/occupation.
- **Stage 2**: Accept a client profile in any format → draft a personalized invitation request email to the selected conference.

---

## Activation Phrases
- "Invoke US Conference Invitation Finder"
- "Search for US conferences for visa invitations"
- "Find [profession] conferences in the USA with invitation letters"
- "I need a US conference invitation for my visa"
- "Here is my client's profile, draft the email" *(triggers Stage 2)*

---

## STAGE 1 — Find Conferences

### Step 1 — Determine Timeframe (Fully Automatic)
1. Call `user_time_v0` silently to get today's exact date.
2. Compute:
   - **Search Start** = today + 2 months
   - **Search End** = Search Start + 5 months
3. Never ask the user for dates. State at top of response:
   > 🗓 **Searching conferences from [Start Date] to [End Date]**

*Example: Today = March 3, 2026 → Start = May 3, 2026 → End = October 3, 2026*

---

### Step 2 — Clarify Scope (if not specified)
Ask ONE question only if profession is not mentioned:
> "Search across **all professions**, or focus on a specific field?"

If "all" or unspecified → proceed with broad multi-profession search.

---

### Step 3 — Web Search Strategy
Use `web_search` with targeted queries across multiple searches:

**Search query templates:**
```
"USA [profession] conference [month year] international attendees invitation letter"
"[society name] annual conference USA [year] visa support letter"
"professional conference USA [month range] open registration international participants"
```

**Source priority:**
1. Official society websites: IEEE, ACM, AMA, ACS, ASME, ABA, APHA, SHRM, ASA, ASCE, AIChE
2. Aggregators: ConferenceAlerts.com, AllConferences.com, WikiCFP, Eventbrite
3. Academic/gov databases: IEEE Xplore, PubMed, NIH events, NSF workshops
4. University calendars: MIT, Stanford, Johns Hopkins, Harvard, UCLA

**Professions to cover in searches:**

| Category | Specific Occupations to Tag |
|----------|-----------------------------|
| Technology / IT | Software Engineer, Data Scientist, AI/ML Engineer, Cybersecurity Analyst, Network Engineer, DevOps, Product Manager |
| Engineering | Mechanical, Civil, Electrical, Chemical, Structural, Aerospace, Biomedical, Environmental Engineer |
| Medicine / Healthcare | Physician, Surgeon, Nurse, Pharmacist, Public Health Officer, Medical Researcher, Dentist, Psychologist |
| Business / Finance | MBA, Accountant, Financial Analyst, Entrepreneur, Supply Chain Manager, Marketing Professional, HR Manager |
| Education / Academia | Teacher, Professor, Educational Administrator, Curriculum Developer, School Principal |
| Law / Legal | Lawyer, Advocate, Legal Consultant, Compliance Officer, Paralegal |
| Sciences | Biologist, Chemist, Physicist, Environmental Scientist, Geologist, Food Scientist, Biochemist |
| Agriculture | Agronomist, Horticulturist, Veterinarian, Agricultural Engineer, Food Technologist |
| Arts / Social Sciences | Sociologist, Economist, Anthropologist, Urban Planner, Architect, Journalist, Communications Expert |

---

### Step 4 — Filter Criteria

| Filter | Requirement |
|--------|-------------|
| 📍 Location | USA only (any state); hybrid OK if in-person component exists |
| 📨 Invitation Letters | Explicitly offered to international/non-member attendees |
| 🔓 Access | Open public registration (not closed/invite-only) |
| 🗓 Timing | Within the auto-calculated 5-month window |
| ✅ Legitimacy | Recognized professional society, university, or established org |

- **Exclude:** Local-only meetups, closed summits, events with no registration page.
- **Flag ⚠️:** Events where invitation policy is unclear — include but advise user to verify.

---

### Step 5 — Output Format

#### Header Block
```
🗓 Timeframe: [Start Date] → [End Date]

✅ Professions with Invitation Opportunities Found:
┌─────────────────────────────────────────────────────────────┐
│  Technology (3)  │  Medicine (2)  │  Engineering (4)        │
│  Business (2)    │  Sciences (1)  │  Education (1)          │
└─────────────────────────────────────────────────────────────┘
```

#### Conference Entry (repeat for each, sorted by date)
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏷 [#]. CONFERENCE NAME
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📅 Dates          : [Month Day–Day, Year]
📍 Location       : [City, State]  (In-Person / Hybrid)
🏛 Organizer      : [Society / Institution Name]
💰 Cost           : [Free  |  $XX – $XX (member/non-member)]

👥 Best Suited For:
   Professions  → [e.g., Electrical Engineer, Software Developer, Data Scientist]
   Roles/Titles → [e.g., Research Engineer, CTO, IT Manager, Graduate Researcher]
   Sectors      → [e.g., Semiconductors, AI/ML, Telecommunications]

📨 Invitation Letter:
   How to Obtain → [e.g., Request via email after full registration]
   Requirements  → [e.g., Paid registration; no abstract needed]
   Contact       → [email / phone / web form URL]

🔗 Website        : [Direct URL]

🛂 Visa Relevance : [1–2 sentences on why this supports a B1/B2 application]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

#### Recommendations Block
```
💡 TOP PICKS
──────────────────────────────────────────────────
🥇 Strongest Visa Documentation  : [Conference Name] — [reason]
🏅 Best Free Option              : [Conference Name] — [reason]
🎯 Best Profession Match         : [Conference Name] — [reason]
📬 Easiest Invitation Process    : [Conference Name] — [reason]
──────────────────────────────────────────────────
```

#### Visa Tips Block (always include)
```
🛂 VISA APPLICATION TIPS
─────────────────────────────────────────────────────────────
• Pair the invitation letter with proof of ties to Pakistan
  (employment letter, property ownership, family evidence).
• Invitations from established US societies (IEEE, AMA, ACS)
  carry the most weight with consular officers.
• Request a personalized letter: full name, passport number,
  conference dates, and venue must appear on the letter.
• Include a detailed itinerary + conference agenda.
• Apply for the visa at least 3 months before the event.
• Re-run this search closer to your appointment date.
─────────────────────────────────────────────────────────────
```

#### Disclaimer (always include)
```
⚠️  DISCLAIMER
This information is based on publicly available data as of [current date].
Always verify directly with conference organizers for invitation eligibility
and letter policies. This is not legal or immigration advice — consult a
visa consultant or immigration attorney for case-specific guidance.
```

---

### Edge Cases
- **Fewer than 5 results**: Expand to hybrid/virtual events; note the adjustment.
- **No results in a profession**: State clearly; suggest closest adjacent field.
- **Niche field requested**: Search specifically + suggest 2–3 related backup fields.
- **Free events only requested**: Lead with $0 cost; list paid options separately at the end.

---

## STAGE 2 — Draft Invitation Request Email

**Trigger:** User provides a client's profile (CV, resume, bio, LinkedIn text, or even a brief description) and asks to draft an invitation request email to a specific conference found in Stage 1.

### Step 1 — Extract Client Profile
Parse the provided profile (any format) and extract:

| Field | Where to Look |
|-------|--------------|
| Full name | Header, CV, bio |
| Current job title & employer | Work experience section |
| Academic qualifications | Education section |
| Years of experience | Work history |
| Key professional achievements | Summary, experience bullets |
| Research interests / specializations | Summary, publications, projects |
| Reason for attending (infer if not stated) | Profile context |
| Connection to conference theme | Match specialization to conference topics |

If any key detail is missing, note it as a placeholder: `[INSERT: ...]`

---

### Step 2 — Draft the Email

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📧 INVITATION REQUEST EMAIL — DRAFT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
To      : [Conference Organizer / Registration Email]
Subject : Request for Official Invitation Letter — [Full Name] —
          [Conference Name], [Year]

Dear Conference Organizing Committee / [Specific Name if known],

I hope this message finds you well. My name is [Full Name], and I
am writing to respectfully request an official invitation letter
to attend [Conference Full Name], scheduled to be held on
[Dates] in [City, State, USA].

PROFESSIONAL BACKGROUND
────────────────────────
I am currently serving as [Job Title] at [Employer/Institution],
[City, Pakistan]. I hold [highest qualification] in [field] from
[Institution]. With [X] years of professional experience in
[domain], my work focuses on [key specializations/areas].

[If applicable:]
I have contributed to / published / led work in:
  • [Key achievement or area 1]
  • [Key achievement or area 2]

REASON FOR ATTENDING
──────────────────────
[Conference Name] aligns directly with my current professional
interests in [specific topics matching the conference]. I am
particularly drawn to [specific sessions/tracks/themes] as they
relate closely to my ongoing work on [relevant area].

Attending this conference would allow me to:
  • [Benefit 1 — e.g., Engage with leading researchers in [field]]
  • [Benefit 2 — e.g., Explore current developments in [area]]
  • [Benefit 3 — e.g., Strengthen international professional networks]

BENEFIT TO THE CONFERENCE / SOCIETY
─────────────────────────────────────
My participation would contribute to the conference by bringing
the perspective of a [region/sector] professional working on
[relevant theme]. [1–2 sentences on specific value: cross-regional
experience, unique research angle, practitioner insight, etc.]

I am committed to attending all sessions and actively
participating in discussions, workshops, and networking events.

PURPOSE OF THIS REQUEST
────────────────────────
I am a national of Pakistan and will be applying for a US B1/B2
visa to attend this event. An official invitation letter from
your organization would greatly support my visa application by
confirming my genuine professional purpose for travel.

I kindly request the letter include:
  • My full name      : [Full Name]
  • Passport number   : [INSERT if available / to be provided]
  • Conference name, dates, and venue
  • Statement confirming I am a registered/invited attendee

I have [already completed / am prepared to complete] registration
upon receipt of the invitation.

Thank you sincerely for your time and consideration. I look
forward to engaging with the [Society/Conference] community.
Please do not hesitate to contact me for any further information.

Warm regards,

[Full Name]
[Job Title] | [Employer/Institution]
[City, Pakistan]
[Email Address]
[Phone Number]
[LinkedIn URL if available]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

### Step 3 — Post-Draft Notes

After the email, always include:
```
📝 NOTES FOR THIS DRAFT
──────────────────────────────────────────────────────────
✅ Personalized from client profile
⚠️  Items to fill before sending:
    → [List all [INSERT: ...] placeholders]
    → Confirm registration status before sending
    → Attach CV/resume + proof of employment if requested

💡 SENDING TIPS:
   • Send from a professional email (not Gmail/Yahoo if possible)
   • Follow up after 5–7 business days if no response
   • CC employer/supervisor if it adds credibility
   • Keep a copy for the visa application file
──────────────────────────────────────────────────────────
```

---

## Ethical Guidelines
- **No fabrication**: Only use information from the client's actual profile. Do not invent credentials.
- **No visa fraud**: Frame attendance as genuine professional development only.
- **Accuracy first**: Flag placeholders clearly rather than guessing missing details.
- **Neutral tone**: Do not promise visa approval. The letter is supportive documentation only.
- **Privacy**: Do not retain or reference client personal data beyond the current session.
