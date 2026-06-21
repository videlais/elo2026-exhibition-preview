import { z } from "zod";
import { ELMSURISchema, ELMSYear } from "./SharedTypes";

export interface ELMSCollectionInformation {
  collectionId?: string;
  collectionName?: string;
  collectionDescription?: string;
  collectionHostedUrl?: z.infer<typeof ELMSURISchema>;
  collectionMetaDescription?: string;
  collectionMetaTitle?: string;
  collectionMetaKeywords?: string[];
  collectionImage?: z.infer<typeof ELMSURISchema>;
  collectionHeaderImage?: z.infer<typeof ELMSURISchema>;
  collectionVideoLink?: z.infer<typeof ELMSURISchema>;
  collectionVideoExternalLink?: z.infer<typeof ELMSURISchema>;
  collectionVideoThumbnail?: z.infer<typeof ELMSURISchema>;
  collectionType?: string;
  collectionProvenance?: string;
  startYearCollected?: ELMSYear;
  endYearCollected?: ELMSYear;
  responsibility?: string;
}
