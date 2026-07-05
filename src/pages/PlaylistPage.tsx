import { useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Container, Row, Col, Form, Button, Badge, InputGroup } from "react-bootstrap";
import PageLayout from "../components/PageLayout";
import WorkGrid from "../components/WorkGrid";
import useWorks from "../hooks/useWorks";
import type ELMSWork from "../types/ELMSWork";
import {
  buildPlaylistParams,
  collectGenres,
  collectKeywords,
  collectPlatforms,
  EMPTY_FILTERS,
  filterWorks,
  getYearRange,
  hasActiveFilters,
  parsePlaylistFilters,
  toggleFacetValue,
  workAuthorText,
  type FacetSelection,
  type PlaylistAIFilter,
  type PlaylistFilters,
} from "../utils/playlist";
import { workAuthorName } from "../utils/works";

type FacetMode = "include" | "exclude";

const AI_OPTIONS: { value: PlaylistAIFilter; label: string }[] = [
  { value: "any", label: "Any" },
  { value: "used", label: "Used AI (content or code)" },
  { value: "content", label: "AI-generated content" },
  { value: "code", label: "AI-generated code" },
  { value: "none", label: "No AI used" },
];

interface IncludeExcludeRowProps {
  idBase: string;
  label: string;
  included: boolean;
  excluded: boolean;
  onToggle: (mode: FacetMode) => void;
}

/** A single value that can be marked as an include (additive) or exclude (subtractive). */
function IncludeExcludeRow({
  idBase,
  label,
  included,
  excluded,
  onToggle,
}: IncludeExcludeRowProps) {
  return (
    <div className="playlistBuilder__row">
      <span className="playlistBuilder__rowLabel">{label}</span>
      <div className="playlistBuilder__rowControls">
        <Form.Check
          type="checkbox"
          id={`${idBase}-include`}
          label="Include"
          aria-label={`Include ${label}`}
          checked={included}
          onChange={() => onToggle("include")}
        />
        <Form.Check
          type="checkbox"
          id={`${idBase}-exclude`}
          label="Exclude"
          aria-label={`Exclude ${label}`}
          checked={excluded}
          onChange={() => onToggle("exclude")}
        />
      </div>
    </div>
  );
}

interface FacetGroupProps {
  legend: string;
  name: string;
  options: string[];
  selection: FacetSelection;
  onToggle: (value: string, mode: FacetMode) => void;
}

function FacetGroup({
  legend,
  name,
  options,
  selection,
  onToggle,
}: FacetGroupProps) {
  if (options.length === 0) return null;
  return (
    <Form.Group
      as="fieldset"
      className="mb-4 playlistBuilder__group"
      controlId={`playlist-${name}`}
    >
      <legend className="playlistBuilder__legend h6 mb-2">{legend}</legend>
      <div className="playlistBuilder__options">
        {options.map((option) => (
          <IncludeExcludeRow
            key={option}
            idBase={`playlist-${name}-${option}`}
            label={option}
            included={selection.include.includes(option)}
            excluded={selection.exclude.includes(option)}
            onToggle={(mode) => onToggle(option, mode)}
          />
        ))}
      </div>
    </Form.Group>
  );
}

interface WorkSearchPickerProps {
  legend: string;
  name: string;
  placeholder: string;
  works: ELMSWork[];
  selection: FacetSelection;
  matches: (work: ELMSWork, query: string) => boolean;
  onToggle: (workId: string, mode: FacetMode) => void;
  maxResults?: number;
}

function WorkSearchPicker({
  legend,
  name,
  placeholder,
  works,
  selection,
  matches,
  onToggle,
  maxResults = 20,
}: WorkSearchPickerProps) {
  const [query, setQuery] = useState("");
  const trimmed = query.trim();

  const allMatches = useMemo(
    () => (trimmed.length === 0 ? [] : works.filter((work) => matches(work, trimmed))),
    [works, matches, trimmed],
  );
  const results = allMatches.slice(0, maxResults);

  return (
    <Form.Group
      as="fieldset"
      className="mb-4 playlistBuilder__group"
      controlId={`playlist-${name}`}
    >
      <legend className="playlistBuilder__legend h6 mb-2">{legend}</legend>
      <Form.Control
        type="search"
        placeholder={placeholder}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        aria-label={legend}
      />
      {trimmed.length > 0 && (
        <div className="playlistBuilder__results mt-2">
          {results.length === 0 ? (
            <p className="text-muted small mb-0">No matching works.</p>
          ) : (
            <>
              {results.map((work) => {
                const workId = work.workInformation.workId;
                const title = work.workInformation.title;
                const author = workAuthorName(work);
                return (
                  <IncludeExcludeRow
                    key={workId}
                    idBase={`playlist-${name}-${workId}`}
                    label={author ? `${title} — ${author}` : title}
                    included={selection.include.includes(workId)}
                    excluded={selection.exclude.includes(workId)}
                    onToggle={(mode) => onToggle(workId, mode)}
                  />
                );
              })}
              {allMatches.length > results.length && (
                <p className="text-muted small mb-0 mt-1">
                  Showing first {results.length} of {allMatches.length} matches —
                  refine your search to narrow the list.
                </p>
              )}
            </>
          )}
        </div>
      )}
    </Form.Group>
  );
}

interface AIModeGroupProps {
  legend: string;
  name: string;
  value: PlaylistAIFilter;
  onChange: (value: PlaylistAIFilter) => void;
}

function AIModeGroup({ legend, name, value, onChange }: AIModeGroupProps) {
  return (
    <Form.Group as="fieldset" className="mb-3" controlId={`playlist-${name}`}>
      <legend className="h6 mb-2">{legend}</legend>
      {AI_OPTIONS.map((option) => (
        <Form.Check
          key={option.value}
          type="radio"
          name={`playlist-${name}`}
          id={`playlist-${name}-${option.value}`}
          label={option.label}
          checked={value === option.value}
          onChange={() => onChange(option.value)}
        />
      ))}
    </Form.Group>
  );
}

interface PlaylistBuilderProps {
  works: ELMSWork[];
  initialFilters: PlaylistFilters;
  onApply: (filters: PlaylistFilters) => void;
  onCancel?: () => void;
}

function PlaylistBuilder({
  works,
  initialFilters,
  onApply,
  onCancel,
}: PlaylistBuilderProps) {
  const [draft, setDraft] = useState<PlaylistFilters>(initialFilters);

  const genres = useMemo(() => collectGenres(works), [works]);
  const keywords = useMemo(() => collectKeywords(works), [works]);
  const platforms = useMemo(() => collectPlatforms(works), [works]);
  const yearRange = useMemo(() => getYearRange(works), [works]);

  const matchCount = useMemo(
    () => filterWorks(works, draft).length,
    [works, draft],
  );
  const active = hasActiveFilters(draft);

  const toggleWork = (workId: string, mode: FacetMode) =>
    setDraft((prev) => ({
      ...prev,
      works: toggleFacetValue(prev.works, workId, mode),
    }));

  const toggleFacet = (
    key: "genres" | "keywords" | "platforms",
    value: string,
    mode: FacetMode,
  ) =>
    setDraft((prev) => ({
      ...prev,
      [key]: toggleFacetValue(prev[key], value, mode),
    }));

  const setYear = (
    key: "yearInclude" | "yearExclude",
    bound: "from" | "to",
    raw: string,
  ) =>
    setDraft((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [bound]: raw === "" ? undefined : Number.parseInt(raw, 10),
      },
    }));

  const worksById = useMemo(() => {
    const map = new Map<string, ELMSWork>();
    for (const work of works) map.set(work.workInformation.workId, work);
    return map;
  }, [works]);

  const chosenWorkIds = useMemo(
    () => [...draft.works.include, ...draft.works.exclude],
    [draft.works.include, draft.works.exclude],
  );
  const chosenWorks = useMemo(
    () =>
      chosenWorkIds
        .map((id) => worksById.get(id))
        .filter((work): work is ELMSWork => work !== undefined),
    [chosenWorkIds, worksById],
  );

  const matchesTitle = useMemo(
    () => (work: ELMSWork, query: string) =>
      work.workInformation.title.toLowerCase().includes(query.toLowerCase()),
    [],
  );
  const matchesAuthor = useMemo(
    () => (work: ELMSWork, query: string) =>
      workAuthorText(work).includes(query.toLowerCase()),
    [],
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onApply(draft);
  };

  return (
    <Container className="py-4">
      <h1 className="h3 mb-2">Build a playlist</h1>
      <p className="text-muted mb-4">
        Using the search and filters, create your own sub-gallery of works with a shareable URL.
      </p>
      <Form onSubmit={handleSubmit} aria-label="Playlist filters">
        <Form.Group className="mb-4" controlId="playlist-name">
          <Form.Label className="h6">Playlist name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Name this playlist (optional)…"
            value={draft.name}
            onChange={(event) =>
              setDraft((prev) => ({ ...prev, name: event.target.value }))
            }
          />
        </Form.Group>

        <Form.Group className="mb-4" controlId="playlist-query">
          <Form.Label className="h6">Keyword search</Form.Label>
          <Form.Control
            type="search"
            placeholder="Match title, description, author, genre, or language…"
            value={draft.query}
            onChange={(event) =>
              setDraft((prev) => ({ ...prev, query: event.target.value }))
            }
          />
        </Form.Group>

        <WorkSearchPicker
          legend="Find works by title"
          name="title"
          placeholder="Search by title…"
          works={works}
          selection={draft.works}
          matches={matchesTitle}
          onToggle={toggleWork}
        />

        <WorkSearchPicker
          legend="Find works by author"
          name="author"
          placeholder="Search by author…"
          works={works}
          selection={draft.works}
          matches={matchesAuthor}
          onToggle={toggleWork}
        />

        {chosenWorks.length > 0 && (
          <fieldset className="mb-4 playlistBuilder__group">
            <legend className="playlistBuilder__legend h6 mb-2">
              Chosen works ({chosenWorks.length})
            </legend>
            <div className="playlistBuilder__options">
              {chosenWorks.map((work) => {
                const workId = work.workInformation.workId;
                const title = work.workInformation.title;
                const author = workAuthorName(work);
                return (
                  <IncludeExcludeRow
                    key={workId}
                    idBase={`playlist-selected-${workId}`}
                    label={author ? `${title} — ${author}` : title}
                    included={draft.works.include.includes(workId)}
                    excluded={draft.works.exclude.includes(workId)}
                    onToggle={(mode) => toggleWork(workId, mode)}
                  />
                );
              })}
            </div>
          </fieldset>
        )}

        <FacetGroup
          legend="Genre (Creator Provided Folksonomy)"
          name="genre"
          options={genres}
          selection={draft.genres}
          onToggle={(value, mode) => toggleFacet("genres", value, mode)}
        />

        <FacetGroup
          legend="Keywords (Controlled Vocabulary)"
          name="keyword"
          options={keywords}
          selection={draft.keywords}
          onToggle={(value, mode) => toggleFacet("keywords", value, mode)}
        />

        <fieldset className="mb-4">
          <legend className="h6 mb-2">Publication year</legend>
          <p className="text-muted small mb-2">
            Include works within a year range, and/or exclude works within one.
          </p>
          <Row className="g-2 align-items-end mb-2">
            <Col xs={12} sm={3} className="fw-semibold small">
              Include years
            </Col>
            <Col xs={6} sm={4} md={3}>
              <Form.Label htmlFor="playlist-yearFrom" className="small">
                From
              </Form.Label>
              <Form.Control
                id="playlist-yearFrom"
                type="number"
                inputMode="numeric"
                min={yearRange?.min}
                max={yearRange?.max}
                placeholder={yearRange ? String(yearRange.min) : undefined}
                value={draft.yearInclude.from ?? ""}
                onChange={(event) =>
                  setYear("yearInclude", "from", event.target.value)
                }
              />
            </Col>
            <Col xs={6} sm={4} md={3}>
              <Form.Label htmlFor="playlist-yearTo" className="small">
                To
              </Form.Label>
              <Form.Control
                id="playlist-yearTo"
                type="number"
                inputMode="numeric"
                min={yearRange?.min}
                max={yearRange?.max}
                placeholder={yearRange ? String(yearRange.max) : undefined}
                value={draft.yearInclude.to ?? ""}
                onChange={(event) =>
                  setYear("yearInclude", "to", event.target.value)
                }
              />
            </Col>
          </Row>
          <Row className="g-2 align-items-end">
            <Col xs={12} sm={3} className="fw-semibold small">
              Exclude years
            </Col>
            <Col xs={6} sm={4} md={3}>
              <Form.Label htmlFor="playlist-exYearFrom" className="small">
                From
              </Form.Label>
              <Form.Control
                id="playlist-exYearFrom"
                type="number"
                inputMode="numeric"
                min={yearRange?.min}
                max={yearRange?.max}
                placeholder={yearRange ? String(yearRange.min) : undefined}
                value={draft.yearExclude.from ?? ""}
                onChange={(event) =>
                  setYear("yearExclude", "from", event.target.value)
                }
              />
            </Col>
            <Col xs={6} sm={4} md={3}>
              <Form.Label htmlFor="playlist-exYearTo" className="small">
                To
              </Form.Label>
              <Form.Control
                id="playlist-exYearTo"
                type="number"
                inputMode="numeric"
                min={yearRange?.min}
                max={yearRange?.max}
                placeholder={yearRange ? String(yearRange.max) : undefined}
                value={draft.yearExclude.to ?? ""}
                onChange={(event) =>
                  setYear("yearExclude", "to", event.target.value)
                }
              />
            </Col>
          </Row>
        </fieldset>

        <FacetGroup
          legend="Authoring Platform (Normalized)"
          name="platform"
          options={platforms}
          selection={draft.platforms}
          onToggle={(value, mode) => toggleFacet("platforms", value, mode)}
        />

        <fieldset className="mb-4">
          <legend className="h6 mb-2">Artificial Intelligence Usage</legend>
          <AIModeGroup
            legend="Require AI usage (include)"
            name="ai-include"
            value={draft.aiInclude}
            onChange={(value) =>
              setDraft((prev) => ({ ...prev, aiInclude: value }))
            }
          />
          <AIModeGroup
            legend="Exclude AI usage (subtract)"
            name="ai-exclude"
            value={draft.aiExclude}
            onChange={(value) =>
              setDraft((prev) => ({ ...prev, aiExclude: value }))
            }
          />
        </fieldset>

        <div className="d-flex flex-wrap gap-2 align-items-center">
          <Button type="submit" variant="primary" disabled={!active}>
            View playlist ({matchCount})
          </Button>
          {onCancel && (
            <Button type="button" variant="outline-secondary" onClick={onCancel}>
              Cancel
            </Button>
          )}
          {active && (
            <Button
              type="button"
              variant="link"
              onClick={() => setDraft(EMPTY_FILTERS)}
            >
              Reset
            </Button>
          )}
        </div>
      </Form>
    </Container>
  );
}

interface PlaylistGalleryProps {
  works: ELMSWork[];
  filters: PlaylistFilters;
  onEdit: () => void;
  onClear: () => void;
}

function PlaylistGallery({
  works,
  filters,
  onEdit,
  onClear,
}: PlaylistGalleryProps) {
  const results = useMemo(
    () => filterWorks(works, filters),
    [works, filters],
  );

  const [copied, setCopied] = useState(false);
  const shareInputRef = useRef<HTMLInputElement>(null);
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable (e.g. insecure context) — select the text
      // so the reader can copy it manually.
      shareInputRef.current?.select();
    }
  };

  const chips: { label: string; kind: FacetMode }[] = [];
  const pushCount = (facet: FacetSelection, noun: string) => {
    if (facet.include.length > 0) {
      chips.push({
        label: `${facet.include.length} ${noun}${facet.include.length !== 1 ? "s" : ""}`,
        kind: "include",
      });
    }
    if (facet.exclude.length > 0) {
      chips.push({
        label: `${facet.exclude.length} excluded ${noun}${facet.exclude.length !== 1 ? "s" : ""}`,
        kind: "exclude",
      });
    }
  };
  const pushFacet = (facet: FacetSelection, prefix: string) => {
    facet.include.forEach((value) =>
      chips.push({ label: `${prefix}: ${value}`, kind: "include" }),
    );
    facet.exclude.forEach((value) =>
      chips.push({ label: `${prefix}: ${value}`, kind: "exclude" }),
    );
  };

  pushCount(filters.works, "selected work");
  if (filters.query.trim().length > 0) {
    chips.push({ label: `Search: “${filters.query.trim()}”`, kind: "include" });
  }
  pushFacet(filters.genres, "Genre");
  pushFacet(filters.keywords, "Keyword");
  pushFacet(filters.platforms, "Platform");
  if (filters.yearInclude.from !== undefined || filters.yearInclude.to !== undefined) {
    const from = filters.yearInclude.from ?? "…";
    const to = filters.yearInclude.to ?? "…";
    chips.push({ label: `Year: ${from}–${to}`, kind: "include" });
  }
  if (filters.yearExclude.from !== undefined || filters.yearExclude.to !== undefined) {
    const from = filters.yearExclude.from ?? "…";
    const to = filters.yearExclude.to ?? "…";
    chips.push({ label: `Year: ${from}–${to}`, kind: "exclude" });
  }
  if (filters.aiInclude !== "any") {
    const aiLabel = AI_OPTIONS.find((option) => option.value === filters.aiInclude);
    if (aiLabel) chips.push({ label: `AI: ${aiLabel.label}`, kind: "include" });
  }
  if (filters.aiExclude !== "any") {
    const aiLabel = AI_OPTIONS.find((option) => option.value === filters.aiExclude);
    if (aiLabel) chips.push({ label: `AI: ${aiLabel.label}`, kind: "exclude" });
  }

  return (
    <Container className="py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2">
        <h1 className="h3 mb-0">{filters.name.trim().length > 0 ? filters.name : "Playlist"}</h1>
        <div className="d-flex gap-2">
          <Button variant="outline-primary" size="sm" onClick={onEdit}>
            Edit filters
          </Button>
          <Button variant="outline-secondary" size="sm" onClick={onClear}>
            Clear
          </Button>
        </div>
      </div>

      {chips.length > 0 && (
        <div className="d-flex flex-wrap gap-2 mb-3" aria-label="Active filters">
          {chips.map((chip) => (
            <Badge
              key={`${chip.kind}:${chip.label}`}
              bg={chip.kind === "exclude" ? "danger" : "secondary"}
              className="fw-normal"
            >
              {chip.kind === "exclude" ? `Exclude · ${chip.label}` : chip.label}
            </Badge>
          ))}
        </div>
      )}

      <p className="text-muted mb-3">
        {results.length} work{results.length !== 1 ? "s" : ""} in this playlist
      </p>

      {results.length === 0 ? (
        <p>No works match this playlist. Try adjusting the filters.</p>
      ) : (
        <WorkGrid works={results} ariaLabel="Playlist works" />
      )}

      <div className="mt-4 pt-3 border-top">
        <label htmlFor="playlistShareUrl" className="h6 d-block mb-2">
          Share this playlist
        </label>
        <InputGroup>
          <Form.Control
            id="playlistShareUrl"
            ref={shareInputRef}
            type="text"
            value={shareUrl}
            readOnly
            onFocus={(event) => event.currentTarget.select()}
            aria-label="Shareable playlist URL"
          />
          <Button variant="primary" onClick={handleCopy}>
            {copied ? "Copied!" : "Copy link"}
          </Button>
        </InputGroup>
        <span className="visually-hidden" role="status" aria-live="polite">
          {copied ? "Link copied to clipboard" : ""}
        </span>
      </div>
    </Container>
  );
}

export default function PlaylistPage() {
  const works = useWorks();
  const [searchParams, setSearchParams] = useSearchParams();
  const [editing, setEditing] = useState(false);

  const filters = useMemo(
    () => parsePlaylistFilters(searchParams),
    [searchParams],
  );
  const active = hasActiveFilters(filters);
  const showBuilder = !active || editing;

  const handleApply = (next: PlaylistFilters) => {
    setSearchParams(buildPlaylistParams(next));
    setEditing(false);
    window.scrollTo(0, 0);
  };

  const handleClear = () => {
    setSearchParams(new URLSearchParams());
    setEditing(false);
  };

  return (
    <PageLayout id="playlistMain" ariaLabel="Playlist">
      {showBuilder ? (
        <PlaylistBuilder
          works={works}
          initialFilters={active ? filters : EMPTY_FILTERS}
          onApply={handleApply}
          onCancel={active ? () => setEditing(false) : undefined}
        />
      ) : (
        <PlaylistGallery
          works={works}
          filters={filters}
          onEdit={() => setEditing(true)}
          onClear={handleClear}
        />
      )}
    </PageLayout>
  );
}
