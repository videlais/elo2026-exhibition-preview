import type ELMSWork from "../types/ELMSWork";

export type PlaylistAIFilter = "any" | "used" | "content" | "code" | "none";

export interface PlaylistFilters {
  name: string;
  workIds: string[];
  genres: string[];
  keywords: string[];
  platforms: string[];
  yearFrom?: number;
  yearTo?: number;
  ai: PlaylistAIFilter;
}

const AI_VALUES: readonly PlaylistAIFilter[] = [
  "any",
  "used",
  "content",
  "code",
  "none",
];

export const EMPTY_FILTERS: PlaylistFilters = {
  name: "",
  workIds: [],
  genres: [],
  keywords: [],
  platforms: [],
  yearFrom: undefined,
  yearTo: undefined,
  ai: "any",
};

/** Splits a semicolon/comma separated authoring platform string into trimmed parts. */
export function splitPlatforms(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.flatMap((item) => splitPlatforms(item));
  }
  if (typeof value !== "string") return [];
  return value
    .split(/[;,]/)
    .map((part) => part.trim())
    .filter((part) => part.length > 0);
}

function parseYear(value: string | null): number | undefined {
  if (value === null || value.trim().length === 0) return undefined;
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? undefined : parsed;
}

function isAIFilter(value: string | null): value is PlaylistAIFilter {
  return value !== null && (AI_VALUES as readonly string[]).includes(value);
}

/**
 * Expands repeated params and delimiter-separated values into a trimmed list.
 * Genre/keyword values can themselves contain commas, so those facets use a
 * pipe ("|") delimiter while numeric work ids use a comma.
 */
function splitParamValues(values: string[], separator: string): string[] {
  return values
    .flatMap((value) => value.split(separator))
    .map((value) => value.trim())
    .filter((value) => value.length > 0);
}

/** Reads playlist filters from URL search parameters. */
export function parsePlaylistFilters(params: URLSearchParams): PlaylistFilters {
  const aiParam = params.get("ai");
  return {
    name: params.get("name")?.trim() ?? "",
    workIds: splitParamValues(params.getAll("work"), ","),
    genres: splitParamValues(params.getAll("genre"), "|"),
    keywords: splitParamValues(params.getAll("keyword"), "|"),
    platforms: splitParamValues(params.getAll("platform"), "|"),
    yearFrom: parseYear(params.get("yearFrom")),
    yearTo: parseYear(params.get("yearTo")),
    ai: isAIFilter(aiParam) ? aiParam : "any",
  };
}

/** True when at least one filter would narrow the result set. */
export function hasActiveFilters(filters: PlaylistFilters): boolean {
  return (
    filters.workIds.length > 0 ||
    filters.genres.length > 0 ||
    filters.keywords.length > 0 ||
    filters.platforms.length > 0 ||
    filters.yearFrom !== undefined ||
    filters.yearTo !== undefined ||
    filters.ai !== "any"
  );
}

/** Serializes filters into a URLSearchParams instance suitable for the playlist route. */
export function buildPlaylistParams(filters: PlaylistFilters): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.name.trim().length > 0) {
    params.set("name", filters.name.trim());
  }
  if (filters.workIds.length > 0) {
    params.set("work", filters.workIds.join(","));
  }
  if (filters.genres.length > 0) {
    params.set("genre", filters.genres.join("|"));
  }
  if (filters.keywords.length > 0) {
    params.set("keyword", filters.keywords.join("|"));
  }
  if (filters.platforms.length > 0) {
    params.set("platform", filters.platforms.join("|"));
  }
  if (filters.yearFrom !== undefined) {
    params.set("yearFrom", String(filters.yearFrom));
  }
  if (filters.yearTo !== undefined) {
    params.set("yearTo", String(filters.yearTo));
  }
  if (filters.ai !== "any") {
    params.set("ai", filters.ai);
  }
  return params;
}

/** Concatenated, lowercased author (entity) names for a work. */
export function workAuthorText(work: ELMSWork): string {
  return (work.entityInformation ?? [])
    .map((entity) => entity.entityName ?? "")
    .join(" ")
    .toLowerCase();
}

/** True when a work satisfies every active facet filter (AND across facets). */
function matchesFacets(work: ELMSWork, filters: PlaylistFilters): boolean {
  const genres = filters.genres.map((g) => g.toLowerCase());
  const keywords = filters.keywords.map((k) => k.toLowerCase());
  const platforms = filters.platforms.map((p) => p.toLowerCase());

  if (genres.length > 0) {
    const workGenres = (work.versionInformation?.genres ?? []).map((g) =>
      g.toLowerCase(),
    );
    if (!genres.some((g) => workGenres.includes(g))) return false;
  }

  if (keywords.length > 0) {
    const workKeywords = (
      work.creatorMetadataInformation?.creatorKeywords ?? []
    ).map((k) => k.toLowerCase());
    if (!keywords.some((k) => workKeywords.includes(k))) return false;
  }

  if (platforms.length > 0) {
    const workPlatforms = splitPlatforms(
      work.versionInformation?.authoringPlatform,
    ).map((p) => p.toLowerCase());
    if (!platforms.some((p) => workPlatforms.includes(p))) return false;
  }

  const year = work.versionInformation?.publicationYear;
  if (filters.yearFrom !== undefined) {
    if (year === undefined || year < filters.yearFrom) return false;
  }
  if (filters.yearTo !== undefined) {
    if (year === undefined || year > filters.yearTo) return false;
  }

  if (filters.ai !== "any") {
    const ai = work.artificialIntelligenceInformation;
    const content = ai?.artificialIntelligenceGeneratedContent ?? false;
    const code = ai?.artificialIntelligenceGeneratedCode ?? false;
    switch (filters.ai) {
      case "used":
        if (!content && !code) return false;
        break;
      case "content":
        if (!content) return false;
        break;
      case "code":
        if (!code) return false;
        break;
      case "none":
        if (content || code) return false;
        break;
    }
  }

  return true;
}

/** True when any facet filter (genre/keyword/platform/year/AI) is active. */
function hasFacetFilters(filters: PlaylistFilters): boolean {
  return (
    filters.genres.length > 0 ||
    filters.keywords.length > 0 ||
    filters.platforms.length > 0 ||
    filters.yearFrom !== undefined ||
    filters.yearTo !== undefined ||
    filters.ai !== "any"
  );
}

/**
 * Resolves a playlist to its works: the union of explicitly selected works
 * (by id) and any works matching the active facet filters.
 */
export function filterWorks(
  works: ELMSWork[],
  filters: PlaylistFilters,
): ELMSWork[] {
  const selected = new Set(filters.workIds);
  const facetActive = hasFacetFilters(filters);

  return works.filter((work) => {
    if (selected.has(work.workInformation.workId)) return true;
    if (!facetActive) return false;
    return matchesFacets(work, filters);
  });
}

function collectSorted(values: Iterable<string>): string[] {
  const set = new Set<string>();
  for (const value of values) {
    const trimmed = value.trim();
    if (trimmed.length > 0) set.add(trimmed);
  }
  return Array.from(set).sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: "base" }),
  );
}

/** Unique, sorted list of all genres present across works. */
export function collectGenres(works: ELMSWork[]): string[] {
  return collectSorted(
    works.flatMap((work) => work.versionInformation?.genres ?? []),
  );
}

/** Unique, sorted list of all creator keywords present across works. */
export function collectKeywords(works: ELMSWork[]): string[] {
  return collectSorted(
    works.flatMap(
      (work) => work.creatorMetadataInformation?.creatorKeywords ?? [],
    ),
  );
}

/** Unique, sorted list of all authoring platforms present across works. */
export function collectPlatforms(works: ELMSWork[]): string[] {
  return collectSorted(
    works.flatMap((work) =>
      splitPlatforms(work.versionInformation?.authoringPlatform),
    ),
  );
}

/** Minimum and maximum publication years present across works, if any. */
export function getYearRange(
  works: ELMSWork[],
): { min: number; max: number } | undefined {
  const years = works
    .map((work) => work.versionInformation?.publicationYear)
    .filter((year): year is NonNullable<typeof year> => typeof year === "number")
    .map((year) => Number(year));
  if (years.length === 0) return undefined;
  return { min: Math.min(...years), max: Math.max(...years) };
}
