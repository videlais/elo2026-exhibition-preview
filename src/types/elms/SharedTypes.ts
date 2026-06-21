import { z } from "zod";

export const ELMSURISchema = z.url();

export type ELMSMonth = "January" | "February" | "March" | "April" | "May" | "June" |
            "July" | "August" | "September" | "October" | "November" | "December";

export const ELMSYearSchema = z.number().int().min(1950).max(2100).brand("ELMSYear");
export type ELMSYear = z.infer<typeof ELMSYearSchema>;

export const ELMSDateSchema = z.iso.date().brand("ELMSDate");
export type ELMSDate = z.infer<typeof ELMSDateSchema>;

// Start of ELMS VersionInformation block
export type ELMSVPublicationStatus = "published" | "unpublished";
