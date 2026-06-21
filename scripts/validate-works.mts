/**
 * Temporary validation script — run with:
 *   npx tsx scripts/validate-works.mts
 *
 * Builds a permissive Zod schema that mirrors the ELMSWork interfaces and
 * reports every field mismatch in works.json.
 */
import { z } from 'zod';
import works from '../src/json/works.json' with { type: 'json' };

// ── Shared ────────────────────────────────────────────────────────────────────

const monthEnum = z.enum([
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]);

// Use plain number (not branded) so raw JSON values pass
const yearSchema = z.number().int().min(1950).max(2100);

// ── Sub-schemas ───────────────────────────────────────────────────────────────

const workInformationSchema = z.object({
  title: z.string(),
  workId: z.string(),
  workDescription: z.string(),
  curatorialStatement: z.string(),
  instructions: z.string(),
  documentationLicense: z.string(),
});

const versionInformationSchema = z.object({
  version: z.string(),
  versionId: z.union([z.number(), z.string()]),
  versionNumber: z.string().optional(),
  versionLetter: z.string().optional(),
  imageThumbnail: z.string().url().optional(),
  originalPublicationStatus: z.enum(['published', 'unpublished']).optional(),
  incomplete: z.boolean().optional(),
  authorialVersion: z.boolean().optional(),
  originalPublicationMonth: monthEnum.optional(),
  originalPublicationYear: yearSchema.optional(),
  originalPublicationType: z.string().optional(),
  originalPublisher: z.string().optional(),
  originalPublisherAuthority: z.string().url().optional(),
  originalVolume: z.string().optional(),
  originalIssue: z.string().optional(),
  originalMediaFormat: z.string().optional(),
  publicationDay: z.number().optional(),
  publicationMonth: monthEnum.optional(),
  publicationYear: yearSchema.optional(),
  softwareDependencies: z.array(z.string()).optional(),
  authoringPlatform: z.string().optional(),
  hardwareDependencies: z.array(z.string()).optional(),
  peripheralDependencies: z.array(z.string()).optional(),
  computerLanguages: z.array(z.string()).optional(),
  digitalQualities: z.array(z.string()).optional(),
  sensoryModalities: z.array(z.string()).optional(),
  genres: z.array(z.string()).optional(),
  languages: z.array(z.string()).optional(),
  accessibility: z.string().optional(),
  rightsNotice: z.string().optional(),
  eldLink: z.string().url().optional(),
  elmcipLink: z.string().url().optional(),
  rebootingElectronicLiteratureLink: z.string().url().optional(),
});

const accessibilityInformationSchema = z.object({
  contentTiming: z.union([z.string(), z.array(z.string())]).optional(),
  textFormat: z.union([z.string(), z.array(z.string())]).optional(),
  colorAndContrast: z.union([z.string(), z.array(z.string())]).optional(),
  visualImpact: z.union([z.string(), z.array(z.string())]).optional(),
  auditory: z.union([z.string(), z.array(z.string())]).optional(),
  touch: z.union([z.string(), z.array(z.string())]).optional(),
  hapticFeedback: z.union([z.string(), z.array(z.string())]).optional(),
  repetitiveMotion: z.union([z.string(), z.array(z.string())]).optional(),
  movementAndGesture: z.union([z.string(), z.array(z.string())]).optional(),
});

const entityInformationSchema = z.union([
  z.object({
    entityId: z.union([z.number(), z.string()]),
    entityName: z.string(),
    nameAuthority: z.string().url().optional(),
    entityType: z.enum(['individual', 'group']).optional(),
    entityCountryOfOrigin: z.string().optional(),
    role: z.string(),
    roleAbbreviation: z.string().optional(),
    primaryRole: z.boolean().optional(),
    rolePseudonym: z.string().optional(),
    entityRoleId: z.number().optional(),
  }),
  z.array(z.object({
    entityId: z.union([z.number(), z.string()]),
    entityName: z.string(),
    nameAuthority: z.string().url().optional(),
    entityType: z.enum(['individual', 'group']).optional(),
    entityCountryOfOrigin: z.string().optional(),
    role: z.string(),
    roleAbbreviation: z.string().optional(),
    primaryRole: z.boolean().optional(),
    rolePseudonym: z.string().optional(),
    entityRoleId: z.number().optional(),
  })),
]);

const externalLinkSchema = z.union([
  z.object({
    externalLinkName: z.string(),
    externalLinkId: z.number().optional(),
    externalLinkUrl: z.string().url(),
  }),
  z.array(z.object({
    externalLinkName: z.string(),
    externalLinkId: z.number().optional(),
    externalLinkUrl: z.string().url(),
  })),
]);

const aiInformationSchema = z.object({
  artificialIntelligenceGeneratedContent: z.boolean(),
  artificialIntelligenceGeneratedCode: z.boolean(),
  artificialIntelligenceToolsUsed: z.array(z.string()).optional(),
  artificialIntelligenceModelsUsed: z.array(z.string()).optional(),
  artificialIntelligenceExternalLinks: z.array(z.string().url()).optional(),
});

const mediaFilesSchema = z.object({
  coverImage: z.string().url().optional(),
  traversalVideo: z.string().url().optional(),
});

const creatorMetadataSchema = z.object({
  creatorKeywords: z.array(z.string()).optional(),
  creatorBiography: z.string().optional(),
});

const elmsWorkSchema = z.object({
  workInformation: workInformationSchema,
  versionInformation: versionInformationSchema.optional(),
  accessibilityInformation: accessibilityInformationSchema.optional(),
  entityInformation: entityInformationSchema.optional(),
  worksExternalLinkInformation: externalLinkSchema.optional(),
  worksExternalLinksInformation: externalLinkSchema.optional(),
  artificialIntelligenceInformation: aiInformationSchema.optional(),
  mediaFilesInformation: mediaFilesSchema.optional(),
  creatorMetadataInformation: creatorMetadataSchema.optional(),
});

// ── Run validation ────────────────────────────────────────────────────────────

let passCount = 0;
let failCount = 0;

for (const [i, work] of (works as unknown[]).entries()) {
  const result = elmsWorkSchema.safeParse(work);
  const title = (work as Record<string, Record<string, string>>)?.workInformation?.title ?? `Work #${i}`;

  if (result.success) {
    console.log(`✓  [${i}] ${title}`);
    passCount++;
  } else {
    console.log(`✗  [${i}] ${title}`);
    const fmt = result.error.format();
    console.dir(fmt, { depth: 6 });
    failCount++;
  }
}

console.log(`\n${passCount} passed, ${failCount} failed`);
