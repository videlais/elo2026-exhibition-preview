import { z } from "zod";
import { ELMSURISchema } from "./SharedTypes";

export interface ELMSWorksExternalLinksInformation {
  externalLinkName: string;
  externalLinkId: number;
  externalLinkUrl: z.infer<typeof ELMSURISchema>;
}
