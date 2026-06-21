import { z } from 'zod';
import { ELMSURISchema } from './SharedTypes';

export interface ELMSMediaFilesInformation {
  /** A cover image representing the work visually. */
  coverImage?: z.infer<typeof ELMSURISchema>;
  /** A recorded video traversal of the work, providing a guided experience. */
  traversalVideo?: z.infer<typeof ELMSURISchema>;
}