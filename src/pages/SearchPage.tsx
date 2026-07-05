import { useState } from "react";
import { Link } from "react-router-dom";
import { Container, Form, InputGroup } from "react-bootstrap";
import PageLayout from "../components/PageLayout";
import WorkGrid from "../components/WorkGrid";
import useWorks from "../hooks/useWorks";
import { workMatchesQuery, type SearchField } from "../utils/playlist";

const FIELD_OPTIONS: { value: SearchField; label: string }[] = [
  { value: "all", label: "All fields" },
  { value: "title", label: "Title" },
  { value: "author", label: "Author" },
  { value: "genre", label: "Genre" },
  { value: "keyword", label: "Keyword" },
  { value: "language", label: "Language" },
];

export default function SearchPage() {
  const allWorks = useWorks();
  const [query, setQuery] = useState("");
  const [field, setField] = useState<SearchField>("all");
  const trimmed = query.trim();

  const filtered =
    trimmed.length === 0
      ? allWorks
      : allWorks.filter((work) => workMatchesQuery(work, trimmed, field));

  const fieldLabel = FIELD_OPTIONS.find((option) => option.value === field)?.label;
  const placeholder =
    field === "all"
      ? "Search by title, author, genre, keyword, language…"
      : `Search by ${fieldLabel?.toLowerCase()}…`;

  const refineHref = `/playlist${trimmed.length > 0 ? `?q=${encodeURIComponent(trimmed)}` : ""}`;

  return (
    <PageLayout id="searchMain">
      <Container className="py-4">
        <Form role="search" aria-label="Search works" className="mb-4">
          <InputGroup>
            <Form.Select
              value={field}
              onChange={(e) => setField(e.target.value as SearchField)}
              aria-label="Field to search"
              style={{ maxWidth: "12rem" }}
            >
              {FIELD_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Form.Select>
            <Form.Control
              type="search"
              placeholder={placeholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search works"
              autoFocus
            />
          </InputGroup>
        </Form>
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
          <p className="text-muted mb-0">
            {filtered.length} work{filtered.length !== 1 ? "s" : ""} found
          </p>
          <Link to={refineHref} className="small">
            Refine with advanced filters →
          </Link>
        </div>
        <WorkGrid works={filtered} ariaLabel="Search results" />
      </Container>
    </PageLayout>
  );
}
