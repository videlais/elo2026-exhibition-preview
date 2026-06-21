import { z } from 'zod';
import { ELMSURISchema } from './SharedTypes';

export interface ELMSArtificialIntelligenceInformation {
    artificialIntelligenceGeneratedContent: boolean;
    artificialIntelligenceGeneratedCode: boolean;
    artificialIntelligenceToolsUsed?: string[];
    artificialIntelligenceModelsUsed?: string[];
    artificialIntelligenceExternalLinks?: z.infer<typeof ELMSURISchema>[];
}