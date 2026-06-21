import { z } from 'zod';
import { ELMSURISchema, ELMSMonth, ELMSYear, ELMSVPublicationStatus } from './SharedTypes';

export type ELMSVersionInformation = {
  version: string;
  versionId: number;
  versionNumber?: string;
  versionLetter?: string;
  imageThumbnail?: z.infer<typeof ELMSURISchema>;
  originalPublicationStatus?: ELMSVPublicationStatus;
  incomplete?: boolean;
  authorialVersion?: boolean;
  originalPublicationMonth?: ELMSMonth;
  originalPublicationYear?: ELMSYear;
  originalPublicationType?: string;
  originalPublisher?: string;
  originalPublisherAuthority?: z.infer<typeof ELMSURISchema>;
  originalVolume?: string;
  originalIssue?: string;
  originalMediaFormat?: string;
  publicationMonth?: ELMSMonth;
  publicationYear?: ELMSYear;
  softwareDependencies?: string[];
  authoringPlatform?: string;
  hardwareDependencies?: string[];
  peripheralDependencies?: string[];
  computerLanguages?: string[];
  digitalQualities?: string[];
  sensoryModalities?: string[];
  genres?: string[];
  languages?: string[];
  accessibility?: string;
  rightsNotice?: string;
  eldLink?: z.infer<typeof ELMSURISchema>;
  elmcipLink?: z.infer<typeof ELMSURISchema>;
  rebootingElectronicLiteratureLink?: z.infer<typeof ELMSURISchema>;
}
