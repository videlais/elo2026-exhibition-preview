import { useState } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Form } from "react-bootstrap";
import PageLayout from "../components/PageLayout";
import useWorks from "../hooks/useWorks";

export default function SearchPage() {
  const allWorks = useWorks();
  const [query, setQuery] = useState("");

  const filtered = query.trim().length === 0
    ? allWorks
    : allWorks.filter((work) => {
      const q = query.toLowerCase();
      const title = work.workInformation.title.toLowerCase();
      const description = work.workInformation.workDescription.toLowerCase();
      const authorName = work.entityInformation
        ? work.entityInformation.map((e) => e.entityName).join(" ").toLowerCase()
        : "";
      const genres = work.versionInformation?.genres?.join(" ").toLowerCase() ?? "";
      const languages = work.versionInformation?.languages?.join(" ").toLowerCase() ?? "";
      return title.includes(q) || description.includes(q) || authorName.includes(q) || genres.includes(q) || languages.includes(q);
    });

  return (
    <PageLayout id="searchMain">
      <Container className="py-4">
        <Form role="search" aria-label="Search works" className="mb-4">
          <Form.Control
            type="search"
            placeholder="Search by title, author, genre, language…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search works"
            autoFocus
          />
        </Form>
        <p className="text-muted mb-3">{filtered.length} work{filtered.length !== 1 ? "s" : ""} found</p>
        <Row className="g-3" role="list" aria-label="Search results">
          {filtered.map((work) => {
            const workId = work.workInformation.workId;
            const title = work.workInformation.title;
            const coverSrc = work.mediaFilesInformation?.coverImage ?? "";
            const authorName = work.entityInformation
              ? work.entityInformation.find((e) => e.primaryRole)?.entityName ?? work.entityInformation[0]?.entityName ?? ""
              : "";

            return (
              <Col key={workId} xs={12} sm={6} md={4} xl={2} role="listitem">
                <article className="galleryCard h-100">
                  <Link to={`/${workId}`} aria-label={`View ${title} by ${authorName}`}>
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
                      {authorName && <p className="galleryCard__author">{authorName}</p>}
                    </div>
                  </Link>
                </article>
              </Col>
            );
          })}
        </Row>
      </Container>
    </PageLayout>
  );
}
