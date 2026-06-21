import type ELMSWork from "../types/ELMSWork";

const PUBLISHER = "Electronic Literature Organization";
const ADDRESS = "Université Grenoble Alpes, Grenoble, France";
const LANGID = "en-US";
const EXHIBITION_YEAR = 2026;
const EXHIBITION_EDITORS = [
  { family: "Skains", given: "Lyle" },
  { family: "Cox", given: "Daniel" },
] as const;

function toCitationAuthors(work: ELMSWork) {
  const entities = work.entityInformation ?? [];
  return entities
    .filter((e) => e.entityType !== "group" && e.entityName)
    .map((e) => {
      const parts = e.entityName.trim().split(/\s+/);
      const family = parts[parts.length - 1] ?? "";
      const given = parts.slice(0, -1).join(" ");
      return { family, given };
    });
}

function getPublicationYear(work: ELMSWork): number | undefined {
  const v = work.versionInformation;
  const year = v?.publicationYear ?? v?.originalPublicationYear;
  return typeof year === "number" ? year : year ? Number(year) : undefined;
}

export function getWorkCiteKey(work: ELMSWork): string {
  const firstAuthor = toCitationAuthors(work)[0]?.family.toLowerCase().replace(/[^a-z0-9]/g, "");
  return `${firstAuthor || "work"}${EXHIBITION_YEAR}${work.workInformation.workId}`;
}

export function buildWorkCitation(work: ELMSWork, publicUrl: string): Record<string, unknown> {
  const today = new Date();
  const authors = toCitationAuthors(work);
  const year = getPublicationYear(work);

  return {
    type: "book",
    id: getWorkCiteKey(work),
    author: authors,
    editor: EXHIBITION_EDITORS,
    title: work.workInformation.title,
    issued: { "date-parts": [[EXHIBITION_YEAR]] },
    publisher: PUBLISHER,
    abstract: work.workInformation.workDescription,
    address: ADDRESS,
    langid: LANGID,
    accessed: {
      "date-parts": [[today.getFullYear(), today.getMonth() + 1, today.getDate()]],
    },
    ...(year ? { "original-date": { "date-parts": [[year]] } } : {}),
    URL: publicUrl,
  };
}
