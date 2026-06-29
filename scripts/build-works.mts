/**
 * Build script — converts per-work Markdown files into src/json/works.json.
 *
 *   npx tsx scripts/build-works.mts
 *
 * Each work lives in src/works/*.md. YAML frontmatter holds the structured
 * metadata; the Markdown body holds the long prose sections, separated by
 * level-1 headings whose text names the target field, e.g.:
 *
 *   # description           -> workInformation.workDescription
 *   # curatorialStatement   -> workInformation.curatorialStatement
 *   # instructions          -> workInformation.instructions
 *   # creatorBiography      -> creatorMetadataInformation.creatorBiography
 *
 * Prose is converted to inline HTML to match the existing JSON shape.
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { marked } from 'marked';

const __dirname = dirname(fileURLToPath(import.meta.url));
const WORKS_DIR = resolve(__dirname, '../src/works');
const OUTPUT = resolve(__dirname, '../src/json/works.json');

// Heading text -> prose field name. Aliases keep the Markdown friendly.
const SECTION_ALIASES: Record<string, string> = {
  description: 'workDescription',
  workdescription: 'workDescription',
  curatorialstatement: 'curatorialStatement',
  instructions: 'instructions',
  creatorbiography: 'creatorBiography',
};

/** Split a Markdown body into { fieldName: html } keyed by its `# heading`. */
function parseSections(body: string): Record<string, string> {
  const sections: Record<string, string> = {};
  const parts = body.split(/^#\s+(.+)$/m); // [pre, heading, content, heading, content, ...]
  for (let i = 1; i < parts.length; i += 2) {
    const key = SECTION_ALIASES[parts[i].trim().toLowerCase()];
    if (!key) continue;
    sections[key] = marked.parse(parts[i + 1].trim(), { async: false }).trim();
  }
  return sections;
}

function buildWork(fm: Record<string, unknown>, sections: Record<string, string>) {
  const version = (fm.version ?? {}) as Record<string, unknown>;
  const accessibility = (fm.accessibility ?? {}) as Record<string, unknown>;
  const ai = (fm.ai ?? {}) as Record<string, unknown>;

  return {
    workInformation: {
      title: fm.title ?? '',
      workId: String(fm.workId ?? ''),
      workDescription: sections.workDescription ?? '',
      curatorialStatement: sections.curatorialStatement ?? '',
      instructions: sections.instructions ?? '',
      documentationLicense: fm.documentationLicense ?? '',
    },
    versionInformation: version,
    accessibilityInformation: accessibility,
    entityInformation: fm.entities ?? [],
    worksExternalLinksInformation: fm.externalLinks ?? [],
    mediaFilesInformation: fm.media ?? {},
    artificialIntelligenceInformation: {
      artificialIntelligenceGeneratedContent: false,
      artificialIntelligenceGeneratedCode: false,
      artificialIntelligenceToolsUsed: [],
      artificialIntelligenceModelsUsed: [],
      artificialIntelligenceExternalLinks: [],
      ...ai,
    },
    creatorMetadataInformation: {
      creatorKeywords: fm.keywords ?? [],
      creatorBiography: sections.creatorBiography ?? '',
    },
  };
}

const files = readdirSync(WORKS_DIR)
  .filter((f) => f.endsWith('.md'))
  .sort();

const works = files
  .map((file) => {
    const { data, content } = matter(readFileSync(join(WORKS_DIR, file), 'utf8'));
    return buildWork(data, parseSections(content));
  })
  .sort((a, b) => Number(a.workInformation.workId) - Number(b.workInformation.workId));

writeFileSync(OUTPUT, JSON.stringify(works, null, 2) + '\n', 'utf8');
console.log(`Wrote ${works.length} works to ${OUTPUT}`);
