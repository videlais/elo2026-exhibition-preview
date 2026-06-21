import { getAllRelators } from "loc-marc-relators";
import { z } from "zod";

// Get all the relators from the loc-marc-relators package and create an enum Zod schema
export const ELMSRelatorSchema = z.enum(getAllRelators().map((relator) => relator.code));
export type MARCRelator = z.infer<typeof ELMSRelatorSchema>;
