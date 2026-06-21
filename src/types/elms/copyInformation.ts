import { z } from "zod";
import { ELMSURISchema, ELMSMonth, ELMSYear, ELMSVPublicationStatus } from "./SharedTypes";

// Start of ELMS CopyInformation block
export interface ELMSCopyInformation {
  copy?: string;
  copyId: number;
  copyImages?: z.infer<typeof ELMSURISchema>[];
  copyPublicationStatus?: ELMSVPublicationStatus;
  copyPublicationMonth?: ELMSMonth;
  copyPublicationYear?: ELMSYear;
  copyPublicationType?: string;
  copyPublisher?: string;
  copyPublisherAuthority?: string;
  copyVolume?: string;
  copyIssue?: string;
  copyMediaFormat?: string;
  originalUrl?: z.infer<typeof ELMSURISchema>;
  hostedUrl?: z.infer<typeof ELMSURISchema>;
  downloadLink?: z.infer<typeof ELMSURISchema>;
  provenance?: string;
  availability?: string;
  preservationMethods?: string[];
  preservationNotes?: string;
  lastTestedDate?: string;
  lastTestedWith?: string;
}
