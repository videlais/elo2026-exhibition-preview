import { describe, it, expect } from "vitest";
import type ELMSWork from "../src/types/ELMSWork";
import {
  buildPlaylistParams,
  collectGenres,
  collectKeywords,
  collectPlatforms,
  filterWorks,
  getYearRange,
  hasActiveFilters,
  parsePlaylistFilters,
  splitPlatforms,
  workAuthorText,
  EMPTY_FILTERS,
  type PlaylistFilters,
} from "../src/utils/playlist";

function makeWork(overrides: {
  workId: string;
  title?: string;
  authors?: string[];
  genres?: string[];
  keywords?: string[];
  authoringPlatform?: string;
  publicationYear?: number;
  aiContent?: boolean;
  aiCode?: boolean;
}): ELMSWork {
  return {
    workInformation: {
      title: overrides.title ?? "Untitled",
      workId: overrides.workId,
      workDescription: "",
      curatorialStatement: "",
      instructions: "",
      documentationLicense: "",
    },
    versionInformation: {
      version: "ELO2026",
      versionId: Number(overrides.workId),
      genres: overrides.genres ?? [],
      authoringPlatform: overrides.authoringPlatform,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      publicationYear: overrides.publicationYear as any,
    },
    accessibilityInformation: {},
    entityInformation: (overrides.authors ?? []).map((name, index) => ({
      entityName: name,
      entityId: index,
      role: "creator",
    })),
    artificialIntelligenceInformation: {
      artificialIntelligenceGeneratedContent: overrides.aiContent ?? false,
      artificialIntelligenceGeneratedCode: overrides.aiCode ?? false,
    },
    mediaFilesInformation: {},
    creatorMetadataInformation: {
      creatorKeywords: overrides.keywords ?? [],
    },
  } as ELMSWork;
}

const works: ELMSWork[] = [
  makeWork({
    workId: "1",
    title: "Immersive VR Poems",
    authors: ["Collier Nogues"],
    genres: ["interactive poetry", "immersive tour"],
    keywords: ["Poetry", "Interactive Arts"],
    authoringPlatform: "A-Frame; 3DVista",
    publicationYear: 2026,
    aiContent: false,
    aiCode: false,
  }),
  makeWork({
    workId: "2",
    title: "Digital Threadings",
    authors: ["Jane Doe"],
    genres: ["Hypertext", "Archival"],
    keywords: ["Archives"],
    authoringPlatform: "HTML",
    publicationYear: 2024,
    aiContent: true,
    aiCode: false,
  }),
  makeWork({
    workId: "3",
    title: "Generative Story",
    genres: ["interactive fiction"],
    keywords: ["Poetry"],
    authoringPlatform: "Twine",
    publicationYear: 2020,
    aiContent: true,
    aiCode: true,
  }),
];

describe("splitPlatforms", () => {
  it("splits on semicolons and commas and trims", () => {
    expect(splitPlatforms("A-Frame; 3DVista, Unity")).toEqual([
      "A-Frame",
      "3DVista",
      "Unity",
    ]);
  });

  it("returns an empty array for undefined", () => {
    expect(splitPlatforms(undefined)).toEqual([]);
  });
});

describe("workAuthorText", () => {
  it("returns lowercased, space-joined author names", () => {
    expect(workAuthorText(works[0])).toBe("collier nogues");
  });

  it("returns an empty string when there are no authors", () => {
    expect(workAuthorText(works[2])).toBe("");
  });
});

describe("parsePlaylistFilters", () => {
  it("reads all supported params", () => {
    const params = new URLSearchParams(
      "name=My%20Mix&work=1,3&genre=Hypertext|Archival&keyword=Poetry&platform=HTML&yearFrom=2020&yearTo=2025&ai=content",
    );
    expect(parsePlaylistFilters(params)).toEqual<PlaylistFilters>({
      name: "My Mix",
      workIds: ["1", "3"],
      genres: ["Hypertext", "Archival"],
      keywords: ["Poetry"],
      platforms: ["HTML"],
      yearFrom: 2020,
      yearTo: 2025,
      ai: "content",
    });
  });

  it("still accepts repeated params for backward compatibility", () => {
    const params = new URLSearchParams(
      "work=12&work=36&genre=Hypertext&genre=Archival",
    );
    const parsed = parsePlaylistFilters(params);
    expect(parsed.workIds).toEqual(["12", "36"]);
    expect(parsed.genres).toEqual(["Hypertext", "Archival"]);
  });

  it("preserves commas inside pipe-delimited genre and keyword values", () => {
    const params = new URLSearchParams(
      "genre=Poetic, Sonic and Visual hypermedia&keyword=Literature in English, North America|Poetry",
    );
    const parsed = parsePlaylistFilters(params);
    expect(parsed.genres).toEqual(["Poetic, Sonic and Visual hypermedia"]);
    expect(parsed.keywords).toEqual([
      "Literature in English, North America",
      "Poetry",
    ]);
  });

  it("falls back to defaults for missing or invalid values", () => {
    const params = new URLSearchParams("ai=bogus");
    expect(parsePlaylistFilters(params)).toEqual(EMPTY_FILTERS);
  });
});

describe("hasActiveFilters", () => {
  it("is false for empty filters", () => {
    expect(hasActiveFilters(EMPTY_FILTERS)).toBe(false);
  });

  it("is true when any filter is set", () => {
    expect(hasActiveFilters({ ...EMPTY_FILTERS, workIds: ["1"] })).toBe(true);
    expect(hasActiveFilters({ ...EMPTY_FILTERS, genres: ["y"] })).toBe(true);
    expect(hasActiveFilters({ ...EMPTY_FILTERS, yearFrom: 2020 })).toBe(true);
    expect(hasActiveFilters({ ...EMPTY_FILTERS, ai: "used" })).toBe(true);
  });

  it("ignores the playlist name when determining active state", () => {
    expect(hasActiveFilters({ ...EMPTY_FILTERS, name: "Just a name" })).toBe(
      false,
    );
  });
});

describe("buildPlaylistParams", () => {
  it("round-trips through parsePlaylistFilters", () => {
    const filters: PlaylistFilters = {
      name: "Weekend Reading",
      workIds: ["1", "2"],
      genres: ["Hypertext"],
      keywords: ["Poetry", "Archives"],
      platforms: ["HTML"],
      yearFrom: 2020,
      yearTo: 2026,
      ai: "used",
    };
    const params = buildPlaylistParams(filters);
    expect(parsePlaylistFilters(params)).toEqual(filters);
  });

  it("encodes the playlist name using percent-encoding", () => {
    const params = buildPlaylistParams({
      ...EMPTY_FILTERS,
      name: "Poems & Play",
    });
    expect(params.toString()).toBe("name=Poems+%26+Play");
  });

  it("serializes selected works as a single comma-separated param", () => {
    const params = buildPlaylistParams({
      ...EMPTY_FILTERS,
      workIds: ["12", "36", "38"],
    });
    expect(params.getAll("work")).toEqual(["12,36,38"]);
  });

  it("serializes text facets as single pipe-delimited params", () => {
    const params = buildPlaylistParams({
      ...EMPTY_FILTERS,
      genres: ["Hypertext", "Archival"],
      keywords: ["Poetry"],
      platforms: ["HTML", "Twine"],
    });
    expect(params.getAll("genre")).toEqual(["Hypertext|Archival"]);
    expect(params.getAll("keyword")).toEqual(["Poetry"]);
    expect(params.getAll("platform")).toEqual(["HTML|Twine"]);
  });

  it("round-trips genre and keyword values that contain commas", () => {
    const filters: PlaylistFilters = {
      ...EMPTY_FILTERS,
      genres: ["Poetic, Sonic and Visual hypermedia", "Hypertext"],
      keywords: ["Literature in English, North America"],
    };
    const params = buildPlaylistParams(filters);
    expect(parsePlaylistFilters(params)).toEqual(filters);
  });

  it("omits inactive filters", () => {
    expect(buildPlaylistParams(EMPTY_FILTERS).toString()).toBe("");
  });
});

describe("filterWorks", () => {
  it("returns no works when no filters are active", () => {
    expect(filterWorks(works, EMPTY_FILTERS)).toHaveLength(0);
  });

  it("includes explicitly selected works by id", () => {
    const result = filterWorks(works, {
      ...EMPTY_FILTERS,
      workIds: ["1", "3"],
    });
    expect(result.map((w) => w.workInformation.workId)).toEqual(["1", "3"]);
  });

  it("unions explicitly selected works with facet matches", () => {
    const result = filterWorks(works, {
      ...EMPTY_FILTERS,
      workIds: ["1"],
      genres: ["Archival"],
    });
    expect(result.map((w) => w.workInformation.workId)).toEqual(["1", "2"]);
  });

  it("matches any selected genre", () => {
    const result = filterWorks(works, {
      ...EMPTY_FILTERS,
      genres: ["Archival", "interactive fiction"],
    });
    expect(result.map((w) => w.workInformation.workId)).toEqual(["2", "3"]);
  });

  it("matches any selected keyword", () => {
    const result = filterWorks(works, { ...EMPTY_FILTERS, keywords: ["Poetry"] });
    expect(result.map((w) => w.workInformation.workId)).toEqual(["1", "3"]);
  });

  it("matches split authoring platforms", () => {
    const result = filterWorks(works, {
      ...EMPTY_FILTERS,
      platforms: ["3DVista"],
    });
    expect(result.map((w) => w.workInformation.workId)).toEqual(["1"]);
  });

  it("filters by publication year range", () => {
    const result = filterWorks(works, {
      ...EMPTY_FILTERS,
      yearFrom: 2024,
      yearTo: 2026,
    });
    expect(result.map((w) => w.workInformation.workId)).toEqual(["1", "2"]);
  });

  it("filters by AI usage", () => {
    expect(
      filterWorks(works, { ...EMPTY_FILTERS, ai: "none" }).map(
        (w) => w.workInformation.workId,
      ),
    ).toEqual(["1"]);
    expect(
      filterWorks(works, { ...EMPTY_FILTERS, ai: "used" }).map(
        (w) => w.workInformation.workId,
      ),
    ).toEqual(["2", "3"]);
    expect(
      filterWorks(works, { ...EMPTY_FILTERS, ai: "code" }).map(
        (w) => w.workInformation.workId,
      ),
    ).toEqual(["3"]);
  });

  it("combines filters with AND logic across facets", () => {
    const result = filterWorks(works, {
      ...EMPTY_FILTERS,
      keywords: ["Poetry"],
      ai: "used",
    });
    expect(result.map((w) => w.workInformation.workId)).toEqual(["3"]);
  });
});

describe("facet collectors", () => {
  it("collects unique, sorted genres", () => {
    expect(collectGenres(works)).toEqual([
      "Archival",
      "Hypertext",
      "immersive tour",
      "interactive fiction",
      "interactive poetry",
    ]);
  });

  it("collects unique, sorted keywords", () => {
    expect(collectKeywords(works)).toEqual([
      "Archives",
      "Interactive Arts",
      "Poetry",
    ]);
  });

  it("collects unique, sorted platforms", () => {
    expect(collectPlatforms(works)).toEqual([
      "3DVista",
      "A-Frame",
      "HTML",
      "Twine",
    ]);
  });

  it("computes the year range", () => {
    expect(getYearRange(works)).toEqual({ min: 2020, max: 2026 });
  });
});
