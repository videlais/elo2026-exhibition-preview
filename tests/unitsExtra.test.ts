import { describe, it, expect } from "vitest";
import {
  withAppBase,
  toWorkRoutePath,
  APP_BASENAME,
  DEFAULT_VERSION_SLUG,
} from "../src/constants/routing";
import { assetUrl } from "../src/utils/assetUrl";
import { buildWorkCitation, getWorkCiteKey } from "../src/constants/workCitation";
import {
  ELMSCountryCodeSchema,
  ELMSRelatorAbbreviationSchema,
} from "../src/types/elms/entityInformation";
import { works } from "../src/data/works";
import type ELMSWork from "../src/types/ELMSWork";

// ──────────────────────────────────────────────
// routing.ts
// ──────────────────────────────────────────────
describe("routing helpers", () => {
  it("withAppBase normalizes and prefixes paths", () => {
    expect(withAppBase("/")).toBe(APP_BASENAME === "/" ? "/" : `${APP_BASENAME}/`);
    expect(withAppBase("search")).toContain("search");
    expect(withAppBase()).toBeTruthy();
    expect(typeof APP_BASENAME).toBe("string");
    expect(DEFAULT_VERSION_SLUG).toBe("1.0.0");
  });

  it("toWorkRoutePath builds nested paths and trims blanks", () => {
    expect(toWorkRoutePath({ workId: "1" })).toBe("/1");
    expect(toWorkRoutePath({ workId: "1", versionSlug: "2.0" })).toBe("/1/2.0");
    expect(toWorkRoutePath({ workId: "1", versionSlug: "2.0", copyId: "a" })).toBe(
      "/1/2.0/a",
    );
    expect(toWorkRoutePath({ workId: "1", versionSlug: "  ", copyId: "" })).toBe("/1");
  });
});

// ──────────────────────────────────────────────
// assetUrl.ts
// ──────────────────────────────────────────────
describe("assetUrl", () => {
  it("passes through absolute, data, and blob URLs", () => {
    expect(assetUrl("https://x.org/a.png")).toBe("https://x.org/a.png");
    expect(assetUrl("http://x.org/a.png")).toBe("http://x.org/a.png");
    expect(assetUrl("data:image/png;base64,AAA")).toContain("data:");
    expect(assetUrl("blob:abc")).toContain("blob:");
  });

  it("prefixes relative paths with the base and strips leading slashes", () => {
    expect(assetUrl("/images/x.png")).toContain("images/x.png");
    expect(assetUrl("images/x.png")).toContain("images/x.png");
  });

  it("returns an empty string for empty input", () => {
    expect(assetUrl("")).toBe("");
    expect(assetUrl(undefined)).toBe("");
    expect(assetUrl(null)).toBe("");
  });
});

// ──────────────────────────────────────────────
// workCitation.ts — author + year branches
// ──────────────────────────────────────────────
describe("workCitation branches", () => {
  const base = works[0];
  type Citation = Record<string, unknown> & {
    author: unknown[];
    "original-date"?: { "date-parts": number[][] };
  };

  it("filters group / empty entities and parses single- and multi-word names", () => {
    const work = {
      ...base,
      entityInformation: [
        { entityType: "group", entityName: "The Collective" },
        { entityType: "individual", entityName: "Prince" },
        { entityType: "individual", entityName: "Ada Lovelace" },
        { entityType: "individual", entityName: "" },
      ],
    } as unknown as ELMSWork;

    const citation = buildWorkCitation(work, "https://x.org") as Citation;
    // Group and empty-name entities are excluded → 2 authors.
    expect(citation.author.length).toBe(2);
    // First remaining author drives the cite key.
    expect(getWorkCiteKey(work)).toContain("prince");
  });

  it("resolves the publication year from a number, a string, or nothing", () => {
    const numYear = {
      ...base,
      versionInformation: { ...base.versionInformation, publicationYear: 2001, originalPublicationYear: undefined },
    } as unknown as ELMSWork;
    expect((buildWorkCitation(numYear, "u") as Citation)["original-date"]?.["date-parts"][0][0]).toBe(2001);

    const strYear = {
      ...base,
      versionInformation: { ...base.versionInformation, publicationYear: undefined, originalPublicationYear: "1999" },
    } as unknown as ELMSWork;
    expect((buildWorkCitation(strYear, "u") as Citation)["original-date"]?.["date-parts"][0][0]).toBe(1999);

    const noYear = {
      ...base,
      versionInformation: { ...base.versionInformation, publicationYear: undefined, originalPublicationYear: undefined },
    } as unknown as ELMSWork;
    expect((buildWorkCitation(noYear, "u") as Citation)["original-date"]).toBeUndefined();
  });

  it("falls back to a 'work' cite key when there are no authors", () => {
    const work = { ...base, entityInformation: [] } as unknown as ELMSWork;
    expect(getWorkCiteKey(work)).toMatch(/^work/);
  });
});

// ──────────────────────────────────────────────
// entityInformation.ts — runtime schemas
// ──────────────────────────────────────────────
describe("entity schemas", () => {
  it("validates ISO country codes", () => {
    expect(ELMSCountryCodeSchema.safeParse("US").success).toBe(true);
    expect(ELMSCountryCodeSchema.safeParse("ZZ").success).toBe(false);
  });

  it("validates MARC relator abbreviations", () => {
    expect(ELMSRelatorAbbreviationSchema.safeParse("aut").success).toBe(true);
    expect(ELMSRelatorAbbreviationSchema.safeParse("__nope__").success).toBe(false);
  });
});
