---
name: client-intelligence
description: >
  AUTO-TRIGGERS on EVERY chat, skill, and project at Farrukh Consultancy. Silently runs alongside all other skills to build a UNIFIED CLIENT MASTER FILE by searching Google Drive, Claude persistent storage, chat history, and family cross-references. ALWAYS trigger when: any client name, CNIC, passport number, case reference, or ID is mentioned; a bank statement, visa application, or immigration document is discussed; a family member (spouse, child, parent, FRC) is referenced; user says client/applicant/case/file; any immigration category is opened (visit, work, study, PR, GCC, Schengen, UK, Canada, Spain DNV, or any country). Run FIRST or IN PARALLEL with gcc-work-permit, bank-statement-analysis, and all visa skills. NEVER skip — even new clients may have prior records elsewhere. Extract all identifiers, search all sources, compile full profile, detect gaps, and hand off enriched context to the active skill.
---

# Client Intelligence Aggregator
## Farrukh Consultancy — Unified Client Memory System

**Owner:** Farrukh Nadeem | Farrukh Consultancy | +92 309 6136080  
**Purpose:** Extract, compile, and maintain a living Master Client File by searching ALL available sources — Google Drive, Claude persistent storage, current and past chat history, related family members, and any uploaded documents — so Farrukh never has to repeat client information across cases.

---

## STEP 0 — Silent Activation Protocol

This skill runs **silently and automatically**. Do NOT announce "I am now running the Client Intelligence skill." Simply execute the steps below in the background and surface results only when they add value. If new information is found about a known client, show it. If a client is confirmed as new, note it briefly.

---

## STEP 1 — Extract Client Identifiers from Current Context

From the current conversation, document, or task, extract every possible identifier:

| Identifier Type | Examples |
|---|---|
| Full Name | Muhammad Ali Khan, Ayesha Tariq |
| Father's Name | S/O, D/O, W/O references |
| CNIC | 35202-1234567-1 |
| Passport Number | AK1234567, BE1234567 |
| Phone Number | +92 3XX XXXXXXX |
| Email Address | any @gmail, @yahoo, etc. |
| Case Reference | FC-2024-001, any internal ref |
| Family Members | Spouse name, children names |
| Employer | Company name for work visa cases |
| Address | City, area, tehsil, district |
| Visa Type | Visit, work, study, PR, DNV, GCC |
| Destination Country | UAE, UK, Canada, Spain, etc. |
| Bank / Financial | Account numbers, bank names |

If multiple identifiers are found, use ALL of them in the search phase.

---

## STEP 2 — Deep Multi-Source Intelligence Search

Search ALL of the following sources **simultaneously** (in parallel where possible):

### 2A — Google Drive Search
Run multiple targeted searches:
```
Search 1: [Client Full Name] visa immigration
Search 2: [Client CNIC] OR [Passport Number]
Search 3: [Client Name] bank statement
Search 4: [Spouse Name] OR [Father Name] Farrukh Consultancy
Search 5: [Case Reference Number] if available
Search 6: [Client Name] [Destination Country]
Search 7: [Employer Name] if work visa context
```
For each result found, open and extract:
- Personal details visible in the document
- Case type and status
- Family members mentioned
- Financial information
- Dates (application, travel, expiry)
- Red flags or notes

### 2B — Claude Persistent Storage Search
Use `window.storage` key-value lookup:
```
Keys to check:
- client:[normalized_name]
- client:cnic:[cnic_number]
- client:passport:[passport_number]
- client:case:[case_reference]
- family:[surname]
```
If found, load the full stored profile and merge with new findings.

### 2C — Current Conversation History
Scan the full current chat for:
- Any previously mentioned client details in this session
- Documents already shared earlier in this conversation
- Instructions or notes Farrukh already gave about this client
- Relationships mentioned (e.g., "his wife", "her husband's employer")

### 2D — Cross-Reference Family & Relationship Network
If any family member is identified, search for THEM separately:
- Spouse: Search spouse name + same address/CNIC series
- Children: Search children names + father/mother name
- Parents: Search for FRC (Family Registration Certificate) references
- Extended family: Search surname + city combinations
- Business partners: Search employer or co-applicant names

The goal: build a **relationship web** where each family member's data enriches the primary client's profile.

---

## STEP 3 — Compile the Master Client File

Once all searches are complete, assemble the **Unified Client Profile**:

```
╔══════════════════════════════════════════════════════════╗
║           FARRUKH CONSULTANCY — CLIENT MASTER FILE        ║
╠══════════════════════════════════════════════════════════╣
║ PERSONAL INFORMATION                                      ║
║  Full Name:                                               ║
║  Father's Name:                                           ║
║  Date of Birth:                                           ║
║  Gender:                                                  ║
║  CNIC:                                                    ║
║  Passport No:          Expiry:                            ║
║  Phone:                Email:                             ║
║  Address:                                                 ║
║  Occupation:           Employer:                          ║
╠══════════════════════════════════════════════════════════╣
║ FAMILY / RELATIONSHIP NETWORK                             ║
║  Spouse:               CNIC:                              ║
║  Children:                                                ║
║  Parents:                                                 ║
║  Other (FRC/Extended):                                    ║
╠══════════════════════════════════════════════════════════╣
║ ACTIVE IMMIGRATION CASES                                  ║
║  Case 1: [Type] | [Country] | [Status] | [Date]           ║
║  Case 2: [Type] | [Country] | [Status] | [Date]           ║
║  (add more as found)                                      ║
╠══════════════════════════════════════════════════════════╣
║ FINANCIAL PROFILE                                         ║
║  Bank(s):                                                 ║
║  Avg Monthly Balance:                                     ║
║  Income Source:                                           ║
║  Last Statement Period:                                   ║
║  Financial Flags:                                         ║
╠══════════════════════════════════════════════════════════╣
║ DOCUMENTS ON FILE                                         ║
║  [ ] Passport Copy     [ ] CNIC Copy                      ║
║  [ ] Bank Statement    [ ] Salary Slips                   ║
║  [ ] NOC/Employment    [ ] Educational Docs               ║
║  [ ] FRC               [ ] Marriage Certificate           ║
║  [ ] Photos            [ ] Other: ___                     ║
╠══════════════════════════════════════════════════════════╣
║ CASE HISTORY & NOTES                                      ║
║  Previous Visas:                                          ║
║  Refusals:                                                ║
║  Important Notes:                                         ║
║  Red Flags:                                               ║
╠══════════════════════════════════════════════════════════╣
║ DATA SOURCES FOUND                                        ║
║  Google Drive: [Y/N] — Files: ___                         ║
║  Claude Storage: [Y/N]                                    ║
║  Current Chat: [Y/N]                                      ║
║  Family Cross-Ref: [Y/N]                                  ║
║  Last Updated: [timestamp]                                ║
╚══════════════════════════════════════════════════════════╝
```

Fill in every field with whatever is found. Mark fields as `[NOT FOUND]` or `[PENDING]` rather than leaving blank.

---

## STEP 4 — Smart Gap Detection

After compiling, identify and flag what is MISSING but NEEDED for the current task:

- If doing a **bank statement analysis** → flag if no income source, employer, or family financial info found
- If doing a **work visa/GCC** → flag if no educational docs, passport expiry, or employer details
- If doing a **visit visa** → flag if no travel history, financial standing, or ties-to-home evidence
- If doing **family reunion/FRC** → flag if spouse/children documents are incomplete

Present gaps as a short, actionable checklist for Farrukh to follow up.

---

## STEP 5 — Save / Update to Persistent Storage

After compiling the profile, ALWAYS save it to Claude's persistent storage:

**Storage key format:**
- Primary: `client:[firstname_lastname_normalized]`
- Secondary: `client:cnic:[cnic_without_dashes]` (if available)
- Family link: `family:[surname]:[list_of_linked_client_keys]`

**On every update:**
- Merge new data with existing stored profile (never overwrite, always enrich)
- Add a `last_updated` timestamp
- Log which case/skill triggered the update
- Link family members bidirectionally

---

## STEP 6 — Handoff to Active Skill

Once the Master Client File is ready, pass it as **live context** to whichever skill is running (GCC Work Permit, Bank Statement Analysis, Visit Visa, etc.):

- Pre-fill all known fields so Farrukh doesn't re-enter data
- Alert if the current task contradicts existing data (e.g., different passport number)
- Note any cross-case intelligence (e.g., "This client's spouse already has a UAE visa — see Drive file X")
- Flag if a family member has a refusal history that may affect this application

---

## STEP 7 — Relationship Intelligence (Advanced)

When family members are found, build **cross-client intelligence**:

**Example scenarios this skill handles automatically:**
- Bank statement shows regular transfers from "Rizwan Ahmed" → Search if Rizwan Ahmed is already a client → Find he's the husband → Pull his GCC work permit case → Note his UAE salary as source of funds for wife's visit visa
- Visit visa application for a woman → Husband already in Drive as UAE work visa client → Auto-link income, sponsor details, visa status
- New client shares surname "Chaudhry" from Lahore → Search all existing Chaudhry clients → Identify possible family connection → Ask Farrukh to confirm

---

## OPERATIONAL RULES

1. **Speed:** Run searches in parallel, not sequentially. Surface results fast.
2. **Depth:** Always search at least 5 different query variations. One search is never enough.
3. **Merging:** When merging data from multiple sources, most recent document wins for factual fields (passport expiry, address). All historical data is preserved, never deleted.
4. **Disambiguation:** If two clients share a similar name, ask Farrukh to confirm with one distinguishing detail (CNIC, city, or case type).
5. **Privacy:** All client data stays within Farrukh Consultancy's workspace. Never summarize client data in plain text outside of the secured profile template.
6. **Proactivity:** If this skill finds something important that Farrukh hasn't asked about (e.g., a passport expiring in 3 months, a prior refusal), surface it immediately with a ⚠️ flag.
7. **Humility:** If a client truly cannot be found anywhere, state this clearly: "No prior records found for [Name]. This appears to be a new client. Starting fresh profile."

---

## UNIVERSAL COMPATIBILITY DECLARATION

This skill is **permanently active and universally compatible** across:

| Scope | Coverage |
|---|---|
| **All Chats** | Every new and existing conversation in Claude.ai |
| **All Current Skills** | gcc-work-permit, bank-statement-analysis, and all installed skills |
| **All Future Skills** | ANY skill installed in the future — auto-integrates without updates |
| **All Projects** | Every Claude.ai Project, now and in the future |
| **All File Types** | PDF, DOCX, XLSX, PPTX, images, scanned documents |
| **All Tasks** | Drafting, research, analysis, document creation, web search |
| **All Contexts** | Even casual chat — if any person's name appears, this skill checks |

### Why It Is Future-Proof

1. **Context-driven, not skill-name-driven** — Any person mentioned in any task triggers the lookup regardless of which skill is running
2. **Enriches, never replaces** — Passes compiled data forward to whatever skill, project, or task is active
3. **Storage-agnostic** — Reads from Google Drive, Claude memory, and chat history regardless of which tool wrote the data originally
4. **Zero maintenance** — Install once. Works forever. No updates needed when new skills or projects are added.

### Universal Handoff Rule
For EVERY skill (current or future), this skill:
- Runs its full client lookup BEFORE or IN PARALLEL with the active skill
- Passes the Master Client File as enriched context
- Saves newly discovered client data back to persistent storage automatically

---

## INTEGRATION WITH CURRENT & FUTURE SKILLS

| Skill | What This Skill Provides |
|---|---|
| `gcc-work-permit` | Personal info, education, UAE/GCC history, family sponsor details |
| `bank-statement-analysis` | Income sources, employer, family financial links, prior statements |
| Visit Visa Support | Travel history, financial standing, ties-to-home evidence |
| Study Visa | Academic history, financial backing, family abroad |
| Spain DNV | Income proof history, professional background, family status |
| **Any Future Skill (auto)** | Full client context from day one — zero re-entry, always |

---

## NOTES FOR FARRUKH

- **Install once — works forever** across every chat, skill, and project automatically
- For maximum power, name Google Drive files: `AliKhan_BankStatement_Jan2025.pdf`
- Cross-reference family in filenames: `AliKhan_SpousePassport_AyshaKhan.pdf`
- The skill grows smarter over time as more client data accumulates
- To manually force a client lookup at any time, say: *"Check records for [Name]"*
