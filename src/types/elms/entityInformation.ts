import { z } from 'zod';
import { ELMSURISchema } from './SharedTypes';
import countries from 'i18n-iso-countries';
import { ELMSRelatorSchema } from './marcRelator';

export type ELMSEntityType = 'individual' | 'group';

// ISO 3166-1 alpha-2 country codes.
const codes = Object.keys(countries.getAlpha2Codes()) as [string, ...string[]];
export const ELMSCountryCodeSchema = z.enum(codes);

// MARC Relator Abbreviations.
export const ELMSRelatorAbbreviationSchema = z.enum(
  ELMSRelatorSchema.options,
);
export type ELMSRelatorAbbreviation = z.infer<typeof ELMSRelatorAbbreviationSchema>;

export interface ELMSEntityInformation {
  entityName: string;
  entityId: number;
  nameAuthority?: z.infer<typeof ELMSURISchema>;
  entityType?: ELMSEntityType;
  entityCountryOfOrigin?: z.infer<typeof ELMSCountryCodeSchema>;
  role: string;
  roleAbbreviation?: ELMSRelatorAbbreviation;
  primaryRole?: boolean;
  rolePseudonym?: string;
  entityRoleId?: number;
};
