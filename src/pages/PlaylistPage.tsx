import { useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Container, Row, Col, Form, Button, Badge, InputGroup } from "react-bootstrap";
import PageLayout from "../components/PageLayout";
import useWorks from "../hooks/useWorks";
import { assetUrl } from "../utils/assetUrl";
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
  workAuthorText,
  type PlaylistAIFilter,
  type PlaylistFilters,
} from "../utils/playlist";

const AI_OPTIONS: { value: PlaylistAIFilter; label: string }[] = [
  { value: "any", label: "Any" },
  { value: "used", label: "Used AI (content or code)" },
  { value: "content", label: "AI-generated content" },
  { value: "code", label: "AI-generated code" },
  { value: "none", label: "No AI used" },
];

function authorNameFor(work: ELMSWork): string {
  const names = (work.entityInformation ?? [])
    .filter((entity) => entity.entityType !== "group" && entity.entityName)
    .map((entity) => entity.entityName);
  if (names.length <= 1) return names[0] ?? "";
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

function toggleValue(list: string[], value: string): string[] {
  return list.includes(value)
    ? list.filter((item) => item !== value)
    : [...list, value];
}

interface CheckboxGroupProps {
  legend: string;
  name: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
}

function CheckboxGroup({
  legend,
  name,
  options,
  selected,
  onToggle,
}: CheckboxGroupProps) {
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
          <Form.Check
            key={option}
            type="checkbox"
            id={`playlist-${name}-${option}`}
            label={option}
            checked={selected.includes(option)}
            onChange={() => onToggle(option)}
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
  selectedIds: string[];
  matches: (work: ELMSWork, query: string) => boolean;
  onToggle: (workId: string) => void;
  maxResults?: number;
}

function WorkSearchPicker({
  legend,
  name,
  placeholder,
  works,
  selectedIds,
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
                const author = authorNameFor(work);
                return (
                  <Form.Check
                    key={workId}
                    type="checkbox"
                    id={`playlist-${name}-${workId}`}
                    checked={selectedIds.includes(workId)}
                    onChange={() => onToggle(workId)}
                    label={author ? `${title} — ${author}` : title}
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

  const toggleWork = (workId: string) =>
    setDraft((prev) => ({
      ...prev,
      workIds: toggleValue(prev.workIds, workId),
    }));

  const selectedWorks = useMemo(
    () =>
      draft.workIds
        .map((id) => works.find((work) => work.workInformation.workId === id))
        .filter((work): work is ELMSWork => work !== undefined),
    [draft.workIds, works],
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

        <WorkSearchPicker
          legend="Find works by title"
          name="title"
          placeholder="Search by title…"
          works={works}
          selectedIds={draft.workIds}
          matches={matchesTitle}
          onToggle={toggleWork}
        />

        <WorkSearchPicker
          legend="Find works by author"
          name="author"
          placeholder="Search by author…"
          works={works}
          selectedIds={draft.workIds}
          matches={matchesAuthor}
          onToggle={toggleWork}
        />

        {selectedWorks.length > 0 && (
          <fieldset className="mb-4 playlistBuilder__group">
            <legend className="playlistBuilder__legend h6 mb-2">
              Selected works ({selectedWorks.length})
            </legend>
            <div className="playlistBuilder__results">
              {selectedWorks.map((work) => {
                const workId = work.workInformation.workId;
                const title = work.workInformation.title;
                const author = authorNameFor(work);
                return (
                  <Form.Check
                    key={workId}
                    type="checkbox"
                    id={`playlist-selected-${workId}`}
                    checked
                    onChange={() => toggleWork(workId)}
                    label={author ? `${title} — ${author}` : title}
                  />
                );
              })}
            </div>
          </fieldset>
        )}

        <CheckboxGroup
          legend="Genre (Creator Provided Folksonomy)"
          name="genre"
          options={genres}
          selected={draft.genres}
          onToggle={(value) =>
            setDraft((prev) => ({
              ...prev,
              genres: toggleValue(prev.genres, value),
            }))
          }
        />

        <CheckboxGroup
          legend="Keywords (Controlled Vocabulary)"
          name="keyword"
          options={keywords}
          selected={draft.keywords}
          onToggle={(value) =>
            setDraft((prev) => ({
              ...prev,
              keywords: toggleValue(prev.keywords, value),
            }))
          }
        />

        <fieldset className="mb-4">
          <legend className="h6 mb-2">Publication year range</legend>
          <Row className="g-2 align-items-end">
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
                value={draft.yearFrom ?? ""}
                onChange={(event) =>
                  setDraft((prev) => ({
                    ...prev,
                    yearFrom:
                      event.target.value === ""
                        ? undefined
                        : Number.parseInt(event.target.value, 10),
                  }))
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
                value={draft.yearTo ?? ""}
                onChange={(event) =>
                  setDraft((prev) => ({
                    ...prev,
                    yearTo:
                      event.target.value === ""
                        ? undefined
                        : Number.parseInt(event.target.value, 10),
                  }))
                }
              />
            </Col>
          </Row>
        </fieldset>

        <CheckboxGroup
          legend="Authoring Platform (Normalized)"
          name="platform"
          options={platforms}
          selected={draft.platforms}
          onToggle={(value) =>
            setDraft((prev) => ({
              ...prev,
              platforms: toggleValue(prev.platforms, value),
            }))
          }
        />

        <Form.Group
          as="fieldset"
          className="mb-4"
          controlId="playlist-ai"
        >
          <legend className="h6 mb-2">Artificial Intelligence Usage</legend>
          {AI_OPTIONS.map((option) => (
            <Form.Check
              key={option.value}
              type="radio"
              name="playlist-ai"
              id={`playlist-ai-${option.value}`}
              label={option.label}
              checked={draft.ai === option.value}
              onChange={() =>
                setDraft((prev) => ({ ...prev, ai: option.value }))
              }
            />
          ))}
        </Form.Group>

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

  const chips: string[] = [];
  if (filters.workIds.length > 0) {
    chips.push(
      `${filters.workIds.length} selected work${filters.workIds.length !== 1 ? "s" : ""}`,
    );
  }
  filters.genres.forEach((genre) => chips.push(`Genre: ${genre}`));
  filters.keywords.forEach((keyword) => chips.push(`Keyword: ${keyword}`));
  filters.platforms.forEach((platform) => chips.push(`Platform: ${platform}`));
  if (filters.yearFrom !== undefined || filters.yearTo !== undefined) {
    const from = filters.yearFrom ?? "…";
    const to = filters.yearTo ?? "…";
    chips.push(`Year: ${from}–${to}`);
  }
  if (filters.ai !== "any") {
    const aiLabel = AI_OPTIONS.find((option) => option.value === filters.ai);
    if (aiLabel) chips.push(`AI: ${aiLabel.label}`);
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
            <Badge key={chip} bg="secondary" className="fw-normal">
              {chip}
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
        <Row className="g-3" role="list" aria-label="Playlist works">
          {results.map((work) => {
            const workId = work.workInformation.workId;
            const title = work.workInformation.title;
            const coverSrc = assetUrl(work.mediaFilesInformation?.coverImage);
            const authorName = authorNameFor(work);

            return (
              <Col key={workId} xs={12} sm={6} md={4} xl={2} role="listitem">
                <article className="galleryCard h-100">
                  <Link
                    to={`/work/${workId}`}
                    aria-label={`View ${title} by ${authorName}`}
                  >
                    {coverSrc && (
                      <img
                        src={coverSrc}
                        alt={`Cover image for ${title}`}
                        className="galleryCard__cover w-100"
                        loading="lazy"
                      />
                    )}
                    <div className="galleryCard__info">
                      <h2 className="galleryCard__title">{title}</h2>
                      {authorName && (
                        <p className="galleryCard__author">{authorName}</p>
                      )}
                    </div>
                  </Link>
                </article>
              </Col>
            );
          })}
        </Row>
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
