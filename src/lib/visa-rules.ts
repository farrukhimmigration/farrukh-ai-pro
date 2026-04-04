/**
 * Structured visa rules engine for Farrukh AI Pro.
 * These rules are extracted from skills_data/ SKILL.md files
 * and used by the AI audit system to validate uploaded documents.
 */

export interface VisaRequirement {
  id: string;
  category: 'mandatory' | 'strongly_recommended' | 'contextual';
  description: string;
  weight: number; // audit scoring weight
}

export interface VisaRuleSet {
  destination: string;
  visaType: string;
  financialMinimum: string;
  requirements: VisaRequirement[];
  redFlags: string[];
}

// ─── Schengen Visit Visa Rules ──────────────────────────────────────
export const SCHENGEN_RULES: VisaRuleSet = {
  destination: 'Schengen',
  visaType: 'Visit Visa',
  financialMinimum: 'EUR 100 × trip duration (minimum days)',
  requirements: [
    { id: 'SCH-01', category: 'mandatory', description: 'Valid passport with 6+ months validity and sufficient blank pages', weight: 15 },
    { id: 'SCH-02', category: 'mandatory', description: 'Completed Schengen Application Form (Harmonized or VIDEX for Germany)', weight: 10 },
    { id: 'SCH-03', category: 'mandatory', description: 'Personal bank statement — 6-month history showing genuine financial activity', weight: 20 },
    { id: 'SCH-04', category: 'mandatory', description: 'Employment/NOC letter — confirms permanent status, salary, and leave approval', weight: 10 },
    { id: 'SCH-05', category: 'mandatory', description: 'Travel insurance with minimum EUR 30,000 emergency coverage', weight: 10 },
    { id: 'SCH-06', category: 'mandatory', description: 'Return flight reservation (not paid ticket)', weight: 8 },
    { id: 'SCH-07', category: 'mandatory', description: 'Hotel/accommodation booking confirmations', weight: 8 },
    { id: 'SCH-08', category: 'strongly_recommended', description: 'FBR/NTN tax filer documentation', weight: 8 },
    { id: 'SCH-09', category: 'strongly_recommended', description: 'Family Registration Certificate (NADRA) — ties to Pakistan', weight: 7 },
    { id: 'SCH-10', category: 'strongly_recommended', description: 'Prior visa history (Schengen/UK/US/UAE stamps)', weight: 5 },
    { id: 'SCH-11', category: 'contextual', description: 'Cover letter explaining financial gaps or lack of travel history', weight: 5 },
    { id: 'SCH-12', category: 'contextual', description: 'Nikah Nama (if married) — family ties evidence', weight: 5 },
    { id: 'SCH-13', category: 'contextual', description: 'Employer bank statement + salary certificate + guarantee letter (if no personal statement)', weight: 10 },
    { id: 'SCH-14', category: 'contextual', description: 'Travel itinerary with day-by-day plan', weight: 4 },
  ],
  redFlags: [
    'Circular transactions in bank statement',
    'Sudden large deposits (window dressing)',
    'Round-number deposits without explanation',
    'No prior international travel history',
    'Unexplained employment gaps',
    'Missing cover letter for financial anomalies',
    'Single/young applicant with no dependents in home country',
    'Balance drops immediately after large deposit',
    'No visible regular salary credits',
  ],
};

// ─── Australia Visitor Visa (600) Rules ─────────────────────────────
export const AUSTRALIA_VISITOR_RULES: VisaRuleSet = {
  destination: 'Australia',
  visaType: 'Visitor Visa (600)',
  financialMinimum: 'AUD 5,000 per person (recommended PKR 1.5M individual / PKR 4M family of 4)',
  requirements: [
    { id: 'AUS-01', category: 'mandatory', description: 'Valid passport with 6+ months validity beyond travel date', weight: 15 },
    { id: 'AUS-02', category: 'mandatory', description: 'CNIC (front and back copies)', weight: 5 },
    { id: 'AUS-03', category: 'mandatory', description: 'Passport-size photographs per IRCC specifications', weight: 5 },
    { id: 'AUS-04', category: 'mandatory', description: 'Bank statement — 6 months showing genuine financial capacity', weight: 20 },
    { id: 'AUS-05', category: 'mandatory', description: 'Bank certificate/account maintenance letter', weight: 5 },
    { id: 'AUS-06', category: 'mandatory', description: 'Employment letter/NOC (employed) or Business Registration + NTN (self-employed)', weight: 10 },
    { id: 'AUS-07', category: 'mandatory', description: 'Salary slips (3-6 months) or Income Tax Returns (2 years)', weight: 8 },
    { id: 'AUS-08', category: 'mandatory', description: 'Property/ownership documents — ties to Pakistan', weight: 8 },
    { id: 'AUS-09', category: 'mandatory', description: 'Cover letter with GTE (Genuine Temporary Entrant) declaration', weight: 10 },
    { id: 'AUS-10', category: 'strongly_recommended', description: 'Return flight reservation', weight: 5 },
    { id: 'AUS-11', category: 'strongly_recommended', description: 'Hotel bookings and travel itinerary', weight: 5 },
    { id: 'AUS-12', category: 'strongly_recommended', description: 'Travel insurance', weight: 5 },
    { id: 'AUS-13', category: 'strongly_recommended', description: 'Family Registration Certificate (NADRA)', weight: 5 },
    { id: 'AUS-14', category: 'contextual', description: 'Nikah Nama and birth certificates (family applications)', weight: 5 },
    { id: 'AUS-15', category: 'contextual', description: 'Sponsor letter + sponsor PR/citizenship docs (sponsored stream)', weight: 8 },
    { id: 'AUS-16', category: 'contextual', description: 'Previous Australian visa / VEVO status check (if applicable)', weight: 5 },
  ],
  redFlags: [
    'Circular lending patterns in bank statement',
    'Large cash deposits within 90 days of application',
    'Balance spike followed by immediate withdrawal',
    'No visible salary credits in bank account',
    'Unemployment with no alternative income proof',
    'Single/young applicant with no dependents',
    'No prior international travel',
    'Previous Australian visa refusals',
    'Insufficient bank balance below minimum threshold',
  ],
};

// ─── Australia 482 TSS Rules ─────────────────────────────────────────
export const AUSTRALIA_482_RULES: VisaRuleSet = {
  destination: 'Australia',
  visaType: '482 Temporary Skill Shortage (TSS)',
  financialMinimum: 'AUD 70,000+ TSMIT annual salary from approved sponsor',
  requirements: [
    { id: '482-01', category: 'mandatory', description: 'Valid passport with 6+ months validity', weight: 15 },
    { id: '482-02', category: 'mandatory', description: 'Job offer from approved Australian Standard Business Sponsor', weight: 20 },
    { id: '482-03', category: 'mandatory', description: 'Minimum 2 years relevant work experience verified by references', weight: 15 },
    { id: '482-04', category: 'mandatory', description: 'IELTS 5.0 minimum or equivalent English proficiency', weight: 10 },
    { id: '482-05', category: 'mandatory', description: 'Occupation verified on MLTSSL, STSOL, or ROL list via ANZSCO code', weight: 15 },
    { id: '482-06', category: 'strongly_recommended', description: 'Professional resume in Australian format (no photo, no DOB, no marital status, max 3 pages)', weight: 8 },
    { id: '482-07', category: 'strongly_recommended', description: 'Skills assessment outcome letter (occupation-dependent)', weight: 8 },
    { id: '482-08', category: 'strongly_recommended', description: 'Educational qualifications: degree certificates and transcripts', weight: 5 },
    { id: '482-09', category: 'contextual', description: 'English language proficiency test results', weight: 5 },
    { id: '482-10', category: 'contextual', description: 'Cover letter addressing 482 visa sponsorship status', weight: 5 },
    { id: '482-11', category: 'contextual', description: 'Employment references covering last 10 years with ANZSCO-matched duties', weight: 10 },
  ],
  redFlags: [
    'Occupation not on any skilled occupation list (MLTSSL/STSOL/ROL)',
    'Employment gaps without explanation',
    'Missing required fields in application',
    'Inconsistencies in experience dates/duties',
    'ANZSCO code mismatch with actual occupation',
    'Sponsor not an approved Standard Business Sponsor',
    'Salary below TSMIT threshold (AUD 70,000)',
    'Insufficient work experience (less than 2 years)',
  ],
};

// ─── Canada Express Entry Rules ──────────────────────────────────────
export const CANADA_EE_RULES: VisaRuleSet = {
  destination: 'Canada',
  visaType: 'Express Entry (FSW/PNP)',
  financialMinimum: 'Proof of funds per family size (varies; single applicant ~CAD 13,757)',
  requirements: [
    { id: 'CA-01', category: 'mandatory', description: 'Valid passport with 6+ months validity', weight: 15 },
    { id: 'CA-02', category: 'mandatory', description: 'CNIC (attested copies)', weight: 5 },
    { id: 'CA-03', category: 'mandatory', description: 'IELTS/PTE General Training — minimum CLB 7 for FSW eligibility', weight: 15 },
    { id: 'CA-04', category: 'mandatory', description: 'ECA (Educational Credential Assessment) — WES preferred', weight: 15 },
    { id: 'CA-05', category: 'mandatory', description: '1+ year skilled work experience in NOC TEER 0/1/2/3', weight: 10 },
    { id: 'CA-06', category: 'mandatory', description: 'Employment references with verified NOC/TEER codes', weight: 10 },
    { id: 'CA-07', category: 'mandatory', description: 'Proof of funds per IRCC requirement for family size', weight: 10 },
    { id: 'CA-08', category: 'strongly_recommended', description: 'Police clearance certificate (NADRA)', weight: 5 },
    { id: 'CA-09', category: 'strongly_recommended', description: 'Medical examination from approved panel physician', weight: 5 },
    { id: 'CA-10', category: 'strongly_recommended', description: 'Educational credentials: degree certificates and transcripts', weight: 5 },
    { id: 'CA-11', category: 'contextual', description: 'Provincial nomination letter (600 bonus CRS points)', weight: 10 },
    { id: 'CA-12', category: 'contextual', description: 'Job offer letter + LMIA (if applicable)', weight: 8 },
    { id: 'CA-13', category: 'contextual', description: 'Marriage certificate/Nikah Nama (spouse CRS factors)', weight: 5 },
    { id: 'CA-14', category: 'contextual', description: 'French language test results (TEF/TCF) for additional CRS points', weight: 5 },
    { id: 'CA-15', category: 'contextual', description: 'Birth certificates for dependent children', weight: 3 },
  ],
  redFlags: [
    'NOC/TEER code mismatch with actual job duties',
    'Age-related CRS score drops (every year after 33)',
    'Low IELTS score (below CLB 9 for competitive CRS)',
    'Insufficient proof of funds for family size',
    'Missing or invalid ECA report',
    'No skilled work experience verifiable by references',
    'Previous Canadian visa refusals',
    'Marital status affecting CRS calculation accuracy',
  ],
};

// ─── Canada Blue Collar Work Permit (TFWP/LMIA) Rules ────────────────
export const CANADA_BC_RULES: VisaRuleSet = {
  destination: 'Canada',
  visaType: 'Blue Collar Work Permit (TFWP/LMIA)',
  financialMinimum: 'CAD 2,550 permit + biometrics + medical per principal applicant',
  requirements: [
    { id: 'BC-01', category: 'mandatory', description: 'Valid passport with 6+ months validity beyond intended stay', weight: 15 },
    { id: 'BC-02', category: 'mandatory', description: 'CNIC (both sides, attested)', weight: 5 },
    { id: 'BC-03', category: 'mandatory', description: 'LMIA approval letter from approved Canadian employer', weight: 20 },
    { id: 'BC-04', category: 'mandatory', description: 'Employment contract/job offer letter specifying NOC code', weight: 15 },
    { id: 'BC-05', category: 'mandatory', description: 'Trade certificate or experience letter (NOC-specific)', weight: 10 },
    { id: 'BC-06', category: 'mandatory', description: 'Canadian-style resume matching trade occupation', weight: 5 },
    { id: 'BC-07', category: 'strongly_recommended', description: 'Police clearance (NADRA)', weight: 5 },
    { id: 'BC-08', category: 'strongly_recommended', description: 'Medical examination from panel physician (if 6+ months stay)', weight: 5 },
    { id: 'BC-09', category: 'strongly_recommended', description: 'Proof of financial capacity (bank statement)', weight: 8 },
    { id: 'BC-10', category: 'strongly_recommended', description: 'Biometrics confirmation (VFS, if first-time Canada visa)', weight: 5 },
    { id: 'BC-11', category: 'contextual', description: 'Prior travel history to Canada/UK/Schengen', weight: 5 },
    { id: 'BC-12', category: 'contextual', description: 'Spouse documents (Nikah Nama, passport, CNIC) if SOWP', weight: 5 },
    { id: 'BC-13', category: 'contextual', description: 'SOWP: IMM 5710 application + spouse bank statement (CAD 2,000-3,000)', weight: 8 },
    { id: 'BC-14', category: 'contextual', description: 'Children: birth certificates (NADRA attested) + medical (if 6+ months)', weight: 5 },
  ],
  redFlags: [
    'NOC code mismatch with trade certificate',
    'LMIA not from approved employer',
    'Missing trade certificate or experience letter',
    'Criminal record without rehabilitation',
    'Failed medical examination',
    'SOWP eligibility error (TEER 4/5 = visitor only)',
    'Insufficient spousal proof (Nikah Nama not attested)',
    'No prior international travel for principal applicant',
  ],
};

// ─── Rule Registry ───────────────────────────────────────────────────
export const VISA_RULES: Record<string, VisaRuleSet> = {
  'schengen-visit': SCHENGEN_RULES,
  'schengen': SCHENGEN_RULES,
  'australia-visitor': AUSTRALIA_VISITOR_RULES,
  'australia-600': AUSTRALIA_VISITOR_RULES,
  'australia-482': AUSTRALIA_482_RULES,
  'australia-tss': AUSTRALIA_482_RULES,
  'canada-ee': CANADA_EE_RULES,
  'canada-express-entry': CANADA_EE_RULES,
  'canada-blue-collar': CANADA_BC_RULES,
  'canada-work-permit': CANADA_BC_RULES,
};

/**
 * Look up the closest matching rule set for a given visa type string.
 * Supports fuzzy matching so "Australia" matches Australia visitor rules.
 */
export function getVisaRules(visaType: string): VisaRuleSet | null {
  const key = visaType.toLowerCase().trim();

  // Direct match
  if (VISA_RULES[key]) return VISA_RULES[key];

  // Fuzzy matching
  if (key.includes('schengen')) return SCHENGEN_RULES;
  if (key.includes('482') || key.includes('tss')) return AUSTRALIA_482_RULES;
  if (key.includes('australia')) return AUSTRALIA_VISITOR_RULES;
  if (key.includes('express') || key.includes('ee')) return CANADA_EE_RULES;
  if (key.includes('canada') || key.includes('blue')) return CANADA_BC_RULES;

  return null;
}

/**
 * Generate the AI audit prompt for a given visa type.
 * This prompt is sent to the AI model along with extracted document text.
 */
export function buildAuditPrompt(rules: VisaRuleSet, extractedText: string, fileName: string): string {
  return `You are Farrukh AI Pro's Document Audit Engine. You are a strict, unforgiving visa document auditor.

## FILE BEING AUDITED
File Name: ${fileName}
Destination: ${rules.destination}
Visa Type: ${rules.visaType}
Financial Threshold: ${rules.financialMinimum}

## DOCUMENT CONTENT
${extractedText}

## AUDIT REQUIREMENTS
Check this document against the following ${rules.requirements.filter(r => r.category === 'mandatory').length} mandatory requirements:

${rules.requirements.filter(r => r.category === 'mandatory').map(r => `- [${r.id}] ${r.description} (weight: ${r.weight})`).join('\n')}

Strongly Recommended (${rules.requirements.filter(r => r.category === 'strongly_recommended').length} items):
${rules.requirements.filter(r => r.category === 'strongly_recommended').map(r => `- [${r.id}] ${r.description}`).join('\n')}

Contextual (${rules.requirements.filter(r => r.category === 'contextual').length} items):
${rules.requirements.filter(r => r.category === 'contextual').map(r => `- [${r.id}] ${r.description}`).join('\n')}

## RED FLAGS TO WATCH FOR
${rules.redFlags.map((f, i) => `${i + 1}. ${f}`).join('\n')}

## YOUR TASK
Analyze the provided document and produce a STRICT JSON audit report with:
1. "score" — a number 0-100 based on how well the document meets the requirements
2. "passed" — list of requirement IDs that are satisfied
3. "failed" — list of requirement IDs that are NOT satisfied with a brief reason
4. "warnings" — list of items that are present but suspicious (flag red flags)
5. "missing" — list of requirement IDs that cannot be assessed from this document
6. "summary" — a 2-3 sentence professional summary of the audit findings
7. "verdict" — one of: "APPROVE", "CONDITIONAL", "REJECT"

Return ONLY valid JSON. No Markdown, no explanations.

{ "score": number, "passed": ["ID1", "ID2"], "failed": [{"id": "ID3", "reason": "..."}], "warnings": ["..."], "missing": ["ID4", "ID5"], "summary": "...", "verdict": "APPROVE|CONDITIONAL|REJECT" }`;
}
