import type ELMSWork from "../types/ELMSWork";

export type PlaylistAIFilter = "any" | "used" | "content" | "code" | "none";

/** A facet where each value can be an include (additive) or exclude (subtractive). */
export interface FacetSelection {
  include: string[];
  exclude: string[];
}

/** A publication-year range; either bound may be left open. */
export interface YearRangeSelection {
  from?: number;
  to?: number;
}

export interface PlaylistFilters {
  name: string;
  query: string;
  works: FacetSelection;
  genres: FacetSelection;
  keywords: FacetSelection;
  platforms: FacetSelection;
  languages: FacetSelection;
  yearInclude: YearRangeSelection;
  yearExclude: YearRangeSelection;
  aiInclude: PlaylistAIFilter;
  aiExclude: PlaylistAIFilter;
}

const AI_VALUES: readonly PlaylistAIFilter[] = [
  "any",
  "used",
  "content",
  "code",
  "none",
];

function emptyFacet(): FacetSelection {
  return { include: [], exclude: [] };
}

export const EMPTY_FILTERS: PlaylistFilters = {
  name: "",
  query: "",
  works: emptyFacet(),
  genres: emptyFacet(),
  keywords: emptyFacet(),
  platforms: emptyFacet(),
  languages: emptyFacet(),
  yearInclude: {},
  yearExclude: {},
  aiInclude: "any",
  aiExclude: "any",
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

function parseAI(value: string | null): PlaylistAIFilter {
  return isAIFilter(value) ? value : "any";
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
  return {
    name: params.get("name")?.trim() ?? "",
    query: params.get("q")?.trim() ?? "",
    works: {
      include: splitParamValues(params.getAll("work"), ","),
      exclude: splitParamValues(params.getAll("exWork"), ","),
    },
    genres: {
      include: splitParamValues(params.getAll("genre"), "|"),
      exclude: splitParamValues(params.getAll("exGenre"), "|"),
    },
    keywords: {
      include: splitParamValues(params.getAll("keyword"), "|"),
      exclude: splitParamValues(params.getAll("exKeyword"), "|"),
    },
    platforms: {
      include: splitParamValues(params.getAll("platform"), "|"),
      exclude: splitParamValues(params.getAll("exPlatform"), "|"),
    },
    languages: {
      include: splitParamValues(params.getAll("language"), "|"),
      exclude: splitParamValues(params.getAll("exLanguage"), "|"),
    },
    yearInclude: {
      from: parseYear(params.get("yearFrom")),
      to: parseYear(params.get("yearTo")),
    },
    yearExclude: {
      from: parseYear(params.get("exYearFrom")),
      to: parseYear(params.get("exYearTo")),
    },
    aiInclude: parseAI(params.get("ai")),
    aiExclude: parseAI(params.get("exAi")),
  };
}

function yearActive(range: YearRangeSelection): boolean {
  return range.from !== undefined || range.to !== undefined;
}

function facetActive(facet: FacetSelection): boolean {
  return facet.include.length > 0 || facet.exclude.length > 0;
}

/** True when at least one filter would narrow the result set. */
export function hasActiveFilters(filters: PlaylistFilters): boolean {
  return (
    filters.query.trim().length > 0 ||
    facetActive(filters.works) ||
    facetActive(filters.genres) ||
    facetActive(filters.keywords) ||
    facetActive(filters.platforms) ||
    facetActive(filters.languages) ||
    yearActive(filters.yearInclude) ||
    yearActive(filters.yearExclude) ||
    filters.aiInclude !== "any" ||
    filters.aiExclude !== "any"
  );
}

/** Serializes filters into a URLSearchParams instance suitable for the playlist route. */
export function buildPlaylistParams(filters: PlaylistFilters): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.name.trim().length > 0) {
    params.set("name", filters.name.trim());
  }
  if (filters.query.trim().length > 0) {
    params.set("q", filters.query.trim());
  }

  const setList = (key: string, values: string[], separator: string) => {
    if (values.length > 0) params.set(key, values.join(separator));
  };

  setList("work", filters.works.include, ",");
  setList("exWork", filters.works.exclude, ",");
  setList("genre", filters.genres.include, "|");
  setList("exGenre", filters.genres.exclude, "|");
  setList("keyword", filters.keywords.include, "|");
  setList("exKeyword", filters.keywords.exclude, "|");
  setList("platform", filters.platforms.include, "|");
  setList("exPlatform", filters.platforms.exclude, "|");
  setList("language", filters.languages.include, "|");
  setList("exLanguage", filters.languages.exclude, "|");

  if (filters.yearInclude.from !== undefined) {
    params.set("yearFrom", String(filters.yearInclude.from));
  }
  if (filters.yearInclude.to !== undefined) {
    params.set("yearTo", String(filters.yearInclude.to));
  }
  if (filters.yearExclude.from !== undefined) {
    params.set("exYearFrom", String(filters.yearExclude.from));
  }
  if (filters.yearExclude.to !== undefined) {
    params.set("exYearTo", String(filters.yearExclude.to));
  }
  if (filters.aiInclude !== "any") {
    params.set("ai", filters.aiInclude);
  }
  if (filters.aiExclude !== "any") {
    params.set("exAi", filters.aiExclude);
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

function lower(values: string[]): string[] {
  return values.map((value) => value.toLowerCase());
}

function workGenres(work: ELMSWork): string[] {
  return lower(work.versionInformation?.genres ?? []);
}

function workKeywords(work: ELMSWork): string[] {
  return lower(work.creatorMetadataInformation?.creatorKeywords ?? []);
}

function workPlatforms(work: ELMSWork): string[] {
  return lower(splitPlatforms(work.versionInformation?.authoringPlatform));
}

function workLanguages(work: ELMSWork): string[] {
  return lower(work.versionInformation?.languages ?? []);
}

/** A field the free-text query can be scoped to. "all" searches every field below. */
export type SearchField =
  | "all"
  | "title"
  | "author"
  | "genre"
  | "keyword"
  | "language";

/** Lowercased searchable text for a work, scoped to a single field (or all fields). */
function workFieldText(work: ELMSWork, field: SearchField): string {
  const info = work.workInformation;
  const genres = (work.versionInformation?.genres ?? []).join(" ");
  const keywords = (work.creatorMetadataInformation?.creatorKeywords ?? []).join(" ");
  const languages = (work.versionInformation?.languages ?? []).join(" ");
  switch (field) {
    case "title":
      return (info.title ?? "").toLowerCase();
    case "author":
      return workAuthorText(work);
    case "genre":
      return genres.toLowerCase();
    case "keyword":
      return keywords.toLowerCase();
    case "language":
      return languages.toLowerCase();
    case "all":
    default:
      return [
        info.title ?? "",
        info.workDescription ?? "",
        workAuthorText(work),
        genres,
        keywords,
        languages,
      ]
        .join(" ")
        .toLowerCase();
  }
}

/** True when the query matches the work within the given field (defaults to all fields). */
export function workMatchesQuery(
  work: ELMSWork,
  query: string,
  field: SearchField = "all",
): boolean {
  const q = query.trim().toLowerCase();
  if (q.length === 0) return true;
  return workFieldText(work, field).includes(q);
}

function workYear(work: ELMSWork): number | undefined {
  const year = work.versionInformation?.publicationYear;
  return typeof year === "number" && Number.isFinite(year) ? year : undefined;
}

/** True when any of the work's values matches any of the (lowercased) filter values. */
function matchesAny(workValues: string[], filterValues: string[]): boolean {
  if (filterValues.length === 0) return false;
  const set = new Set(workValues);
  return lower(filterValues).some((value) => set.has(value));
}

function matchesAI(work: ELMSWork, mode: PlaylistAIFilter): boolean {
  const ai = work.artificialIntelligenceInformation;
  const content = ai?.artificialIntelligenceGeneratedContent ?? false;
  const code = ai?.artificialIntelligenceGeneratedCode ?? false;
  switch (mode) {
    case "used":
      return content || code;
    case "content":
      return content;
    case "code":
      return code;
    case "none":
      return !content && !code;
    default:
      return true;
  }
}

function yearInRange(
  year: number | undefined,
  range: YearRangeSelection,
): boolean {
  if (!yearActive(range)) return false;
  if (year === undefined) return false;
  if (range.from !== undefined && year < range.from) return false;
  if (range.to !== undefined && year > range.to) return false;
  return true;
}

/** True when any additive (include) facet is set. */
function hasIncludeFacets(filters: PlaylistFilters): boolean {
  return (
    filters.query.trim().length > 0 ||
    filters.genres.include.length > 0 ||
    filters.keywords.include.length > 0 ||
    filters.platforms.include.length > 0 ||
    filters.languages.include.length > 0 ||
    yearActive(filters.yearInclude) ||
    filters.aiInclude !== "any"
  );
}

/** True when any include constraint (selected works or include facets) is set. */
function hasIncludeFilters(filters: PlaylistFilters): boolean {
  return filters.works.include.length > 0 || hasIncludeFacets(filters);
}

/** True when a work satisfies every active include facet (AND across facets). */
function matchesIncludeFacets(work: ELMSWork, filters: PlaylistFilters): boolean {
  if (filters.query.trim().length > 0 && !workMatchesQuery(work, filters.query)) {
    return false;
  }
  if (
    filters.genres.include.length > 0 &&
    !matchesAny(workGenres(work), filters.genres.include)
  ) {
    return false;
  }
  if (
    filters.keywords.include.length > 0 &&
    !matchesAny(workKeywords(work), filters.keywords.include)
  ) {
    return false;
  }
  if (
    filters.platforms.include.length > 0 &&
    !matchesAny(workPlatforms(work), filters.platforms.include)
  ) {
    return false;
  }
  if (
    filters.languages.include.length > 0 &&
    !matchesAny(workLanguages(work), filters.languages.include)
  ) {
    return false;
  }
  if (
    yearActive(filters.yearInclude) &&
    !yearInRange(workYear(work), filters.yearInclude)
  ) {
    return false;
  }
  if (filters.aiInclude !== "any" && !matchesAI(work, filters.aiInclude)) {
    return false;
  }
  return true;
}

/**
 * True when a work is admitted by the additive filters: either it is an
 * explicitly included work id, or it matches the active include facets.
 */
function passesIncludes(work: ELMSWork, filters: PlaylistFilters): boolean {
  if (filters.works.include.includes(work.workInformation.workId)) return true;
  if (!hasIncludeFacets(filters)) return false;
  return matchesIncludeFacets(work, filters);
}

/** True when a work matches any subtractive (exclude) filter. */
function matchesAnyExclude(work: ELMSWork, filters: PlaylistFilters): boolean {
  if (filters.works.exclude.includes(work.workInformation.workId)) return true;
  if (matchesAny(workGenres(work), filters.genres.exclude)) return true;
  if (matchesAny(workKeywords(work), filters.keywords.exclude)) return true;
  if (matchesAny(workPlatforms(work), filters.platforms.exclude)) return true;
  if (matchesAny(workLanguages(work), filters.languages.exclude)) return true;
  if (yearInRange(workYear(work), filters.yearExclude)) return true;
  if (filters.aiExclude !== "any" && matchesAI(work, filters.aiExclude)) {
    return true;
  }
  return false;
}

/**
 * Resolves a playlist to its works. Additive (include) filters define the base
 * set — the union of explicitly selected works and works matching the include
 * facets. When only subtractive (exclude) filters are set, the base set is all
 * works. Excludes always win: any work matching an exclude filter is removed.
 */
export function filterWorks(
  works: ELMSWork[],
  filters: PlaylistFilters,
): ELMSWork[] {
  if (!hasActiveFilters(filters)) return [];
  const includeActive = hasIncludeFilters(filters);

  return works.filter((work) => {
    if (includeActive && !passesIncludes(work, filters)) return false;
    if (matchesAnyExclude(work, filters)) return false;
    return true;
  });
}

/**
 * Toggles a facet value in the given mode. A value can be in at most one mode:
 * selecting include clears any exclude on the same value, and vice versa.
 * Selecting the mode a value already occupies removes it.
 */
export function toggleFacetValue(
  selection: FacetSelection,
  value: string,
  mode: "include" | "exclude",
): FacetSelection {
  const alreadySet = selection[mode].includes(value);
  const nextInMode = alreadySet
    ? selection[mode].filter((item) => item !== value)
    : [...selection[mode], value];
  const otherValues = (
    mode === "include" ? selection.exclude : selection.include
  ).filter((item) => item !== value);

  return mode === "include"
    ? { include: nextInMode, exclude: otherValues }
    : { include: otherValues, exclude: nextInMode };
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

/** Unique, sorted list of all languages present across works. */
export function collectLanguages(works: ELMSWork[]): string[] {
  return collectSorted(
    works.flatMap((work) => work.versionInformation?.languages ?? []),
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
