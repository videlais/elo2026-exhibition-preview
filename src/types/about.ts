export interface AboutHeaderLink {
  href: string;
  ariaLabel: string;
  title: string;
}

export interface OrganizersContent {
  title: string;
  chair: string;
  coChairs: string[];
  team: string[];
}

export interface StatementContent {
  title: string;
  paragraphs: string[];
}

export interface LicenseEntry {
  prefix: string;
  href: string;
  linkText: string;
  suffix?: string;
}

export interface LicensesContent {
  title: string;
  entries: LicenseEntry[];
  notes?: string[];
}

export interface VersionHistoryContent {
  title: string;
  entries: string[];
}

export interface CitationContent {
  popoverTitle: string;
  buttonText: string;
  citeKey: string;
}

export interface AboutPageContent {
  headerLink: AboutHeaderLink;
  organizers: OrganizersContent;
  statement: StatementContent;
  licenses: LicensesContent;
  versionHistory?: VersionHistoryContent;
  citation: CitationContent;
}

export interface AboutCitationTemplate {
  entryType: string;
  entryKey: string;
  author: string;
  title: string;
  booktitle: string;
  editor: string;
  volume: string;
  year: string;
  publisher: string;
  address: string;
  langid: string;
}
