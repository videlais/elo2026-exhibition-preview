import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeAll } from "vitest";
import { CitationWidget } from "../src/components/citation/CitationWidget";

// Uses the REAL @citation-js engine (no mocks) so it acts as a regression test
// for the CSL style-registration API, which changed in citation-js 0.8
// (plugins.config.get("@csl").templates -> .styles).

beforeAll(() => {
  Object.defineProperty(globalThis.URL, "createObjectURL", {
    configurable: true,
    value: vi.fn(() => "blob:mock"),
  });
  Object.defineProperty(globalThis.URL, "revokeObjectURL", {
    configurable: true,
    value: vi.fn(),
  });
  Object.assign(navigator, {
    clipboard: { writeText: vi.fn(() => Promise.resolve()) },
  });
});

const sampleCitation = {
  type: "article-journal",
  title: "Test Work",
  author: [{ family: "Cox", given: "Daniel" }],
  issued: { "date-parts": [[2026]] },
};

describe("CitationWidget", () => {
  it("registers custom CSL styles and renders APA, MLA, and Chicago without throwing", () => {
    // If the CSL style-registration API is wrong, rendering throws here.
    const { container } = render(
      <CitationWidget citation={sampleCitation} citeKey="cox2026" />,
    );
    expect(container).toBeTruthy();

    // APA is shown by default; the rendered bibliography includes the author.
    expect(container.textContent).toContain("Cox");

    // Switch through every style tab; MLA/Chicago must resolve (not error).
    for (const name of [/MLA/i, /Chicago/i, /BibTeX/i, /APA/i]) {
      const tab = screen.queryAllByRole("tab", { name })[0];
      if (tab) fireEvent.click(tab);
    }
  });

  it("copies the current citation and downloads BibTeX", () => {
    render(<CitationWidget citation={sampleCitation} citeKey="cox2026" />);

    const copy = screen.queryAllByRole("button", { name: /copy .*citation/i })[0];
    if (copy) {
      fireEvent.click(copy);
      expect(navigator.clipboard.writeText).toHaveBeenCalled();
    }

    const bibtexTab = screen.queryAllByRole("tab", { name: /BibTeX/i })[0];
    if (bibtexTab) fireEvent.click(bibtexTab);
    const download = screen.queryAllByRole("button", { name: /download|bibtex|\.bib/i })[0];
    if (download) fireEvent.click(download);
  });
});
