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
  toggleFacetValue,
  workAuthorText,
  EMPTY_FILTERS,
  type PlaylistFilters,
} from "../src/utils/playlist";

function withFilters(overrides: Partial<PlaylistFilters>): PlaylistFilters {
  return { ...EMPTY_FILTERS, ...overrides };
}

const ids = (result: ELMSWork[]) => result.map((w) => w.workInformation.workId);

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
  it("reads all supported include and exclude params", () => {
    const params = new URLSearchParams(
      "name=My%20Mix&work=1,3&exWork=2&genre=Hypertext|Archival&exGenre=Twine&keyword=Poetry&exKeyword=Archives&platform=HTML&exPlatform=Unity&yearFrom=2020&yearTo=2025&exYearFrom=2010&exYearTo=2012&ai=content&exAi=none",
    );
    expect(parsePlaylistFilters(params)).toEqual<PlaylistFilters>({
      name: "My Mix",
      works: { include: ["1", "3"], exclude: ["2"] },
      genres: { include: ["Hypertext", "Archival"], exclude: ["Twine"] },
      keywords: { include: ["Poetry"], exclude: ["Archives"] },
      platforms: { include: ["HTML"], exclude: ["Unity"] },
      yearInclude: { from: 2020, to: 2025 },
      yearExclude: { from: 2010, to: 2012 },
      aiInclude: "content",
      aiExclude: "none",
    });
  });

  it("still accepts repeated params for backward compatibility", () => {
    const params = new URLSearchParams(
      "work=12&work=36&genre=Hypertext&genre=Archival",
    );
    const parsed = parsePlaylistFilters(params);
    expect(parsed.works.include).toEqual(["12", "36"]);
    expect(parsed.genres.include).toEqual(["Hypertext", "Archival"]);
  });

  it("preserves commas inside pipe-delimited genre and keyword values", () => {
    const params = new URLSearchParams(
      "genre=Poetic, Sonic and Visual hypermedia&keyword=Literature in English, North America|Poetry",
    );
    const parsed = parsePlaylistFilters(params);
    expect(parsed.genres.include).toEqual([
      "Poetic, Sonic and Visual hypermedia",
    ]);
    expect(parsed.keywords.include).toEqual([
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

  it("is true when any include or exclude filter is set", () => {
    expect(
      hasActiveFilters(withFilters({ works: { include: ["1"], exclude: [] } })),
    ).toBe(true);
    expect(
      hasActiveFilters(withFilters({ genres: { include: [], exclude: ["y"] } })),
    ).toBe(true);
    expect(hasActiveFilters(withFilters({ yearInclude: { from: 2020 } }))).toBe(
      true,
    );
    expect(hasActiveFilters(withFilters({ yearExclude: { to: 2020 } }))).toBe(
      true,
    );
    expect(hasActiveFilters(withFilters({ aiInclude: "used" }))).toBe(true);
    expect(hasActiveFilters(withFilters({ aiExclude: "none" }))).toBe(true);
  });

  it("ignores the playlist name when determining active state", () => {
    expect(hasActiveFilters({ ...EMPTY_FILTERS, name: "Just a name" })).toBe(
      false,
    );
  });
});

describe("buildPlaylistParams", () => {
  it("round-trips include and exclude filters through parsePlaylistFilters", () => {
    const filters: PlaylistFilters = {
      name: "Weekend Reading",
      works: { include: ["1", "2"], exclude: ["3"] },
      genres: { include: ["Hypertext"], exclude: ["Twine"] },
      keywords: { include: ["Poetry", "Archives"], exclude: [] },
      platforms: { include: ["HTML"], exclude: ["Unity"] },
      yearInclude: { from: 2020, to: 2026 },
      yearExclude: { from: 2000, to: 2005 },
      aiInclude: "used",
      aiExclude: "content",
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

  it("serializes included and excluded works as comma-separated params", () => {
    const params = buildPlaylistParams(
      withFilters({ works: { include: ["12", "36", "38"], exclude: ["7"] } }),
    );
    expect(params.getAll("work")).toEqual(["12,36,38"]);
    expect(params.getAll("exWork")).toEqual(["7"]);
  });

  it("serializes text facets as single pipe-delimited params", () => {
    const params = buildPlaylistParams(
      withFilters({
        genres: { include: ["Hypertext", "Archival"], exclude: [] },
        keywords: { include: ["Poetry"], exclude: [] },
        platforms: { include: ["HTML", "Twine"], exclude: ["Unity"] },
      }),
    );
    expect(params.getAll("genre")).toEqual(["Hypertext|Archival"]);
    expect(params.getAll("keyword")).toEqual(["Poetry"]);
    expect(params.getAll("platform")).toEqual(["HTML|Twine"]);
    expect(params.getAll("exPlatform")).toEqual(["Unity"]);
  });

  it("round-trips genre and keyword values that contain commas", () => {
    const filters: PlaylistFilters = withFilters({
      genres: {
        include: ["Poetic, Sonic and Visual hypermedia", "Hypertext"],
        exclude: [],
      },
      keywords: {
        include: ["Literature in English, North America"],
        exclude: [],
      },
    });
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
    const result = filterWorks(
      works,
      withFilters({ works: { include: ["1", "3"], exclude: [] } }),
    );
    expect(ids(result)).toEqual(["1", "3"]);
  });

  it("unions explicitly included works with facet matches", () => {
    const result = filterWorks(
      works,
      withFilters({
        works: { include: ["1"], exclude: [] },
        genres: { include: ["Archival"], exclude: [] },
      }),
    );
    expect(ids(result)).toEqual(["1", "2"]);
  });

  it("matches any included genre", () => {
    const result = filterWorks(
      works,
      withFilters({
        genres: { include: ["Archival", "interactive fiction"], exclude: [] },
      }),
    );
    expect(ids(result)).toEqual(["2", "3"]);
  });

  it("matches any included keyword", () => {
    const result = filterWorks(
      works,
      withFilters({ keywords: { include: ["Poetry"], exclude: [] } }),
    );
    expect(ids(result)).toEqual(["1", "3"]);
  });

  it("matches split authoring platforms", () => {
    const result = filterWorks(
      works,
      withFilters({ platforms: { include: ["3DVista"], exclude: [] } }),
    );
    expect(ids(result)).toEqual(["1"]);
  });

  it("filters by an include publication-year range", () => {
    const result = filterWorks(
      works,
      withFilters({ yearInclude: { from: 2024, to: 2026 } }),
    );
    expect(ids(result)).toEqual(["1", "2"]);
  });

  it("filters by AI usage", () => {
    expect(ids(filterWorks(works, withFilters({ aiInclude: "none" })))).toEqual([
      "1",
    ]);
    expect(ids(filterWorks(works, withFilters({ aiInclude: "used" })))).toEqual([
      "2",
      "3",
    ]);
    expect(ids(filterWorks(works, withFilters({ aiInclude: "code" })))).toEqual([
      "3",
    ]);
  });

  it("combines filters with AND logic across include facets", () => {
    const result = filterWorks(
      works,
      withFilters({
        keywords: { include: ["Poetry"], exclude: [] },
        aiInclude: "used",
      }),
    );
    expect(ids(result)).toEqual(["3"]);
  });

  it("starts from all works when only exclude filters are set", () => {
    const result = filterWorks(
      works,
      withFilters({ genres: { include: [], exclude: ["Archival"] } }),
    );
    expect(ids(result)).toEqual(["1", "3"]);
  });

  it("subtracts excluded works by id", () => {
    const result = filterWorks(
      works,
      withFilters({ works: { include: [], exclude: ["2"] } }),
    );
    expect(ids(result)).toEqual(["1", "3"]);
  });

  it("lets exclude win over include for the same work id", () => {
    const result = filterWorks(
      works,
      withFilters({ works: { include: ["1", "2"], exclude: ["2"] } }),
    );
    expect(ids(result)).toEqual(["1"]);
  });

  it("removes works matching an exclude facet even when they match an include", () => {
    const result = filterWorks(
      works,
      withFilters({
        keywords: { include: ["Poetry"], exclude: [] },
        platforms: { include: [], exclude: ["Twine"] },
      }),
    );
    // Works 1 and 3 have the Poetry keyword; work 3 is on Twine and is subtracted.
    expect(ids(result)).toEqual(["1"]);
  });

  it("excludes works by AI usage", () => {
    const result = filterWorks(works, withFilters({ aiExclude: "used" }));
    expect(ids(result)).toEqual(["1"]);
  });

  it("excludes works by publication-year range", () => {
    const result = filterWorks(
      works,
      withFilters({ yearExclude: { from: 2024, to: 2026 } }),
    );
    expect(ids(result)).toEqual(["3"]);
  });
});

describe("toggleFacetValue", () => {
  it("adds a value to the requested mode", () => {
    expect(
      toggleFacetValue({ include: [], exclude: [] }, "A", "include"),
    ).toEqual({ include: ["A"], exclude: [] });
  });

  it("removes a value when toggled in the mode it already occupies", () => {
    expect(
      toggleFacetValue({ include: ["A"], exclude: [] }, "A", "include"),
    ).toEqual({ include: [], exclude: [] });
  });

  it("moves a value from include to exclude", () => {
    expect(
      toggleFacetValue({ include: ["A"], exclude: [] }, "A", "exclude"),
    ).toEqual({ include: [], exclude: ["A"] });
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
