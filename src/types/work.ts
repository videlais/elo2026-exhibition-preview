// Flat compatibility type for card components and legacy display code.
// This represents the flat work shape that card components expect.

export interface BeginLink {
  displayText: string;
  link: string;
}

export interface Work {
  id?: string | number;
  title: string;
  slug?: string;
  url?: string;
  collectionSlug?: string;
  year?: string;
  authorDisplayName?: string;
  creator?: string;
  creatorBiography?: string;
  geographicalOriginOfWork?: string[];
  descriptionOfWork?: string;
  workLicense?: string;
  documentationLicense?: string;
  workLanguage?: string[];
  curatorialStatement?: string;
  creatorKeywords?: string[];
  format?: string[];
  beginLinks?: BeginLink[];
  collaborators?: string;
  instructions?: string;
  genreKeywords?: string[];
  platform?: string[];
  authoringLanguages?: string[];
  contentKeywords?: string[];
  creatorNationality?: string[];
  versionInformation?: {
    genres?: string[];
    rightsNotice?: string;
    originalPublicationYear?: string | number;
    publicationYear?: string | number;
  };
  entityInformation?: Array<{
    entityName: string;
    entityId: number;
    role: string;
    primaryRole?: boolean;
  }>;
  accessibilityInformation?: Record<string, unknown>;
  copyInformation?: Array<{
    copyId: number;
    downloadLink: string;
    copy: string;
    availability: string;
    preservationNotes?: string;
    copyMediaFormat?: string;
  }>;
  worksExternalLinksInformation?: Array<{
    externalLinkName: string;
    externalLinkId: number;
    externalLinkUrl: string;
  }>;
  [key: string]: unknown;
}

// Downloadable work asset
export interface WorkDownload {
  workId?: string | number;
  url?: string;
  linkText: string;
  location: string;
  linkDescription?: string;
  requirements?: string;
  index?: number;
  [key: string]: unknown;
}
