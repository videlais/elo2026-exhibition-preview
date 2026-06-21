import type { Work } from "../types/work";

export function getWorkYear(work: Work): string {
  const publicationYear = work.versionInformation?.originalPublicationYear ?? work.versionInformation?.publicationYear;
  return publicationYear !== undefined ? String(publicationYear) : "";
}

export function getWorkAuthorDisplayName(work: Work): string {
  const entities = work.entityInformation;
  if (!entities) return "";
  if (Array.isArray(entities)) {
    if (entities.length === 0) return "";
    const primary = entities.find((e) => e.primaryRole)?.entityName;
    return primary ?? entities[0].entityName;
  }
  // entityInformation may also be a single object in some data
  return (entities as { entityName?: string }).entityName ?? "";
}

export function getWorkKeywordText(work: Work): string {
  const genres = work.versionInformation?.genres;
  return Array.isArray(genres) ? genres.join("; ") : "";
}

export function getWorkLicense(work: Work): string {
  if (work.workLicense && work.workLicense.trim().length > 0) {
    return work.workLicense;
  }
  return work.versionInformation?.rightsNotice ?? "";
}

export function getDocsLicense(work: Work): string {
  if (work.documentationLicense && work.documentationLicense.trim().length > 0) {
    return work.documentationLicense;
  }
  return work.versionInformation?.rightsNotice ?? "";
}

export function getExternalBeginLinks(work: Work): { displayText: string; link: string }[] {
  const externalLinks = work.worksExternalLinksInformation;
  if (!externalLinks || externalLinks.length === 0) return [];
  return externalLinks
    .filter((link) => link.externalLinkName && link.externalLinkUrl)
    .map((link) => ({
      displayText: link.externalLinkName,
      link: link.externalLinkUrl,
    }));
}
