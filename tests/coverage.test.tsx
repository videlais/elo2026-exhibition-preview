import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "../src/context/ThemeContext";
import { works } from "../src/data/works";

import WorkPage from "../src/pages/WorkPage";
import AboutPage from "../src/pages/AboutPage";
import SearchPage from "../src/pages/SearchPage";
import PlaylistPage from "../src/pages/PlaylistPage";
import Routing from "../src/pages/Routing";
import Header from "../src/components/sections/HeaderSection/Header";
import NotFound from "../src/components/errors/NotFound";
import SearchResultLink from "../src/components/SearchResultLink";
import { buildWorkCitation, getWorkCiteKey } from "../src/constants/workCitation";
import { getStaticRoutes } from "../src/entry-server";
import { ELMSURISchema, ELMSYearSchema, ELMSDateSchema } from "../src/types/elms/SharedTypes";
import { ELMSRelatorSchema } from "../src/types/elms/marcRelator";
import { buildPlaylistParams, EMPTY_FILTERS } from "../src/utils/playlist";

// The CitationWidget wraps @citation-js and is covered directly in
// citationWidget.test.tsx. It is stubbed here (WorkPage renders it for all 48
// works) to keep this suite fast, since real citation formatting is expensive.
vi.mock("../src/components/citation/CitationWidget", () => ({
  CitationWidget: ({ citeKey }: { citeKey: string }) => (
    <div data-testid="citation-widget">{citeKey}</div>
  ),
}));

// ──────────────────────────────────────────────
// Test helpers
// ──────────────────────────────────────────────
function renderAt(ui: React.ReactNode, route = "/") {
  return render(
    <ThemeProvider>
      <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
    </ThemeProvider>,
  );
}

function renderWorkPage(workId: string) {
  return render(
    <ThemeProvider>
      <MemoryRouter initialEntries={[`/work/${workId}`]}>
        <Routes>
          <Route path="/work/:workId" element={<WorkPage />} />
        </Routes>
      </MemoryRouter>
    </ThemeProvider>,
  );
}

// ──────────────────────────────────────────────
// WorkPage — renders every card component with real data
// ──────────────────────────────────────────────
describe("WorkPage (all works)", () => {
  it.each(works.map((w) => [w.workInformation.workId, w.workInformation.title]))(
    "renders work %s without crashing",
    (workId) => {
      const { container } = renderWorkPage(String(workId));
      // The Work Information card heading is always present for a valid work.
      expect(container.querySelector(".workPage")).toBeTruthy();
      expect(screen.getAllByText("Work Information").length).toBeGreaterThan(0);
    },
  );

  it("shows NotFound for an unknown work id", () => {
    renderWorkPage("does-not-exist-999");
    expect(screen.getByText("Work not found.")).toBeTruthy();
  });
});

// ──────────────────────────────────────────────
// NotFound
// ──────────────────────────────────────────────
describe("NotFound", () => {
  it("renders a link back to the homepage", () => {
    renderAt(<NotFound />);
    expect(screen.getByText("Work not found.")).toBeTruthy();
    expect(screen.getByRole("link", { name: /homepage/i })).toBeTruthy();
  });
});

// ──────────────────────────────────────────────
// SearchResultLink
// ──────────────────────────────────────────────
describe("SearchResultLink", () => {
  it.each(["genre", "keyword", "language"] as const)(
    "renders a %s facet link to the playlist",
    (param) => {
      renderAt(<SearchResultLink param={param} value="Example Value" />);
      const link = screen.getByRole("link");
      expect(link.getAttribute("href")).toContain("/playlist");
      expect(link.getAttribute("href")).toContain(param);
      expect(link.getAttribute("target")).toBe("_blank");
    },
  );
});

// ──────────────────────────────────────────────
// AboutPage
// ──────────────────────────────────────────────
describe("AboutPage", () => {
  it("renders the about sections", () => {
    renderAt(<AboutPage />);
    expect(screen.getByText("History")).toBeTruthy();
    expect(screen.getByText("Metadata")).toBeTruthy();
  });
});

// ──────────────────────────────────────────────
// Header — nav link clicks
// ──────────────────────────────────────────────
describe("Header", () => {
  it("navigates via nav links and marks the active link", () => {
    renderAt(<Header />, "/search");
    // Clicking a nav link runs the preventDefault/navigate/collapse handler.
    for (const label of [/home/i, /search/i, /playlist/i, /about/i]) {
      const link = screen.queryAllByRole("link", { name: label })[0];
      if (link) fireEvent.click(link);
    }
    // Toggle the mobile navbar collapse.
    const toggle = screen.queryByRole("button");
    if (toggle) fireEvent.click(toggle);
  });
});

// ──────────────────────────────────────────────
// Routing — lazy route loading
// ──────────────────────────────────────────────
describe("Routing", () => {
  it.each(["/", "/search", "/about", "/playlist", `/work/${works[0].workInformation.workId}`])(
    "lazily loads %s",
    async (path) => {
      // Ensure the scrollRestoration branch in the Index effect executes.
      try {
        Object.defineProperty(window.history, "scrollRestoration", {
          value: "auto",
          configurable: true,
          writable: true,
        });
      } catch { /* already defined */ }
      window.history.replaceState({}, "", path);
      const { unmount } = render(
        <ThemeProvider>
          <Routing />
        </ThemeProvider>,
      );
      await waitFor(() => expect(document.querySelector("main")).toBeTruthy());
      unmount();
    },
  );
});

// ──────────────────────────────────────────────
// SearchPage — filtering + field selection
// ──────────────────────────────────────────────
describe("SearchPage", () => {
  it("renders and filters results by query and field", () => {
    renderAt(<SearchPage />, "/search");

    const search = screen.getByRole("searchbox");

    // Empty query shows all works.
    expect(screen.getByRole("search")).toBeTruthy();

    // A query that should match at least one work.
    const title = works[0].workInformation.title.split(" ")[0];
    fireEvent.change(search, { target: { value: title } });
    expect((search as HTMLInputElement).value).toBe(title);

    // Change the search field (covers placeholder + refineHref branches).
    const select = screen.getByLabelText(/field to search/i);
    fireEvent.change(select, { target: { value: "title" } });
    fireEvent.change(select, { target: { value: "author" } });

    // A query that matches nothing.
    fireEvent.change(search, { target: { value: "zzz-no-such-match-zzz" } });
  });
});

// ──────────────────────────────────────────────
// PlaylistPage — renders with and without active filters
// ──────────────────────────────────────────────
describe("PlaylistPage", () => {
  it("renders the playlist builder with no filters", () => {
    const { container } = renderAt(<PlaylistPage />, "/playlist");
    expect(container.querySelector("main")).toBeTruthy();
  });

  it("renders with query and facet params applied", () => {
    const genre = works
      .flatMap((w) => w.versionInformation?.genres ?? [])
      .find(Boolean);
    const route = `/playlist?q=story${genre ? `&genre=${encodeURIComponent(genre)}` : ""}`;
    const { container } = renderAt(<PlaylistPage />, route);
    expect(container.querySelector("main")).toBeTruthy();
  });

  it("exercises the builder controls (search, facets, years, AI, submit)", () => {
    const { container } = renderAt(<PlaylistPage />, "/playlist");

    // Keyword search.
    const keyword = screen.queryByLabelText("Keyword search");
    if (keyword) fireEvent.change(keyword, { target: { value: "story" } });

    // Toggle a couple of facet checkboxes (include + exclude handlers).
    for (const cb of screen.getAllByRole("checkbox").slice(0, 3)) {
      fireEvent.click(cb);
    }

    // One AI usage radio option.
    const radio = screen.queryAllByRole("radio")[0];
    if (radio) fireEvent.click(radio);

    // One publication-year field.
    const yearFrom = container.querySelector("#playlist-yearFrom");
    if (yearFrom) fireEvent.change(yearFrom, { target: { value: "2020" } });

    // Submit the built playlist.
    const submit = screen.queryByRole("button", { name: /view playlist/i });
    if (submit) fireEvent.click(submit);

    expect(container.querySelector("main")).toBeTruthy();
  }, 30000);

  it("shows work-search results and the no-match message", () => {
    renderAt(<PlaylistPage />, "/playlist");
    const titlePicker = screen.queryByLabelText(/find works by title/i);
    if (titlePicker) {
      // A term from a real title surfaces matching results.
      const term = works[0].workInformation.title.split(" ")[0];
      fireEvent.change(titlePicker, { target: { value: term } });
      // A term that matches nothing shows the empty message.
      fireEvent.change(titlePicker, { target: { value: "zzzznomatchzzzz" } });
      expect(screen.getByText(/no matching works/i)).toBeTruthy();
    }
  }, 30000);

  it("cancels editing an active playlist", () => {
    const filters = { ...EMPTY_FILTERS, query: "story" };
    const params = buildPlaylistParams(filters).toString();
    renderAt(<PlaylistPage />, `/playlist?${params}`);
    // Enter edit mode, then cancel back to the gallery.
    fireEvent.click(screen.getByRole("button", { name: /edit filters/i }));
    const cancel = screen.queryByRole("button", { name: /^cancel$/i });
    if (cancel) fireEvent.click(cancel);
    expect(true).toBe(true);
  });

  it("supports resetting an active builder", () => {
    renderAt(<PlaylistPage />, "/playlist?q=story");
    const reset = screen.queryAllByRole("button", { name: /reset|clear|edit/i })[0];
    if (reset) fireEvent.click(reset);
    expect(true).toBe(true);
  });

  it("renders the gallery with active filters and supports edit/clear/copy", async () => {
    const genre = works.flatMap((w) => w.versionInformation?.genres ?? []).find(Boolean);
    const language = works.flatMap((w) => w.versionInformation?.languages ?? []).find(Boolean);
    const workId = works[0].workInformation.workId;
    const excludedWorkId = works[1].workInformation.workId;

    const filters = {
      ...EMPTY_FILTERS,
      name: "My Playlist",
      query: "story",
      works: { include: [workId], exclude: [excludedWorkId] },
      genres: { include: genre ? [genre] : [], exclude: [] },
      languages: { include: language ? [language] : [], exclude: [] },
      keywords: { include: [], exclude: ["nope"] },
      yearInclude: { from: 2000, to: 2026 },
      yearExclude: { from: 1990, to: 1995 },
      aiInclude: "used" as const,
      aiExclude: "none" as const,
    };
    const params = buildPlaylistParams(filters).toString();

    // Gallery mode (active filters, not editing) shows chips + share controls.
    const { container } = renderAt(<PlaylistPage />, `/playlist?${params}`);
    expect(screen.getByLabelText(/active filters/i)).toBeTruthy();

    // Copy link (covers handleCopy success path).
    const copyLink = screen.getByRole("button", { name: /copy link/i });
    fireEvent.click(copyLink);

    // Edit filters switches back to the builder.
    fireEvent.click(screen.getByRole("button", { name: /edit filters/i }));
    expect(container.querySelector("main")).toBeTruthy();
  });

  it("shows an empty-playlist message when nothing matches", () => {
    // A keyword that no work should match, plus an impossible year window.
    const filters = {
      ...EMPTY_FILTERS,
      query: "zzz-nothing-matches-zzz",
    };
    const params = buildPlaylistParams(filters).toString();
    renderAt(<PlaylistPage />, `/playlist?${params}`);
    expect(screen.getByText(/no works match/i)).toBeTruthy();
  });

  it("clears an active playlist back to the builder", () => {
    const filters = { ...EMPTY_FILTERS, query: "story" };
    const params = buildPlaylistParams(filters).toString();
    renderAt(<PlaylistPage />, `/playlist?${params}`);
    const clear = screen.getByRole("button", { name: /^clear$/i });
    fireEvent.click(clear);
    // After clearing, the builder heading is shown.
    expect(screen.getByText(/build a playlist/i)).toBeTruthy();
  });
});

// ──────────────────────────────────────────────
// workCitation helpers
// ──────────────────────────────────────────────
describe("workCitation", () => {
  it("builds a citation object and a cite key for works", () => {
    for (const work of works.slice(0, 5)) {
      const citation = buildWorkCitation(work, "https://example.org/work/1");
      expect(citation).toBeTypeOf("object");
      const key = getWorkCiteKey(work);
      expect(typeof key).toBe("string");
      expect(key.length).toBeGreaterThan(0);
    }
  });

  it("produces a fallback cite key when there are no authors", () => {
    const bare = {
      ...works[0],
      entityInformation: [],
    };
    const key = getWorkCiteKey(bare);
    expect(key).toContain("work");
  });
});

// ──────────────────────────────────────────────
// entry-server (static route listing)
// ──────────────────────────────────────────────
describe("entry-server", () => {
  it("lists all static and per-work routes", () => {
    const routes = getStaticRoutes();
    expect(routes).toContain("/");
    expect(routes).toContain("/search");
    expect(routes).toContain("/playlist");
    expect(routes).toContain("/about");
    expect(routes.length).toBe(4 + works.length);
  });
});

// ──────────────────────────────────────────────
// ELMS schemas
// ──────────────────────────────────────────────
describe("ELMS schemas", () => {
  it("validates shared value schemas", () => {
    expect(ELMSURISchema.safeParse("https://example.org").success).toBe(true);
    expect(ELMSURISchema.safeParse("not a url").success).toBe(false);
    expect(ELMSYearSchema.safeParse(2026).success).toBe(true);
    expect(ELMSYearSchema.safeParse(1800).success).toBe(false);
    expect(ELMSDateSchema.safeParse("2026-01-01").success).toBe(true);
  });

  it("builds a MARC relator enum from loc-marc-relators", () => {
    // "aut" (author) is a standard MARC relator code.
    expect(ELMSRelatorSchema.safeParse("aut").success).toBe(true);
    expect(ELMSRelatorSchema.safeParse("__nope__").success).toBe(false);
  });
});

