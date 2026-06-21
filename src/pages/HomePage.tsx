import { Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import PageLayout from "../components/PageLayout";
import useWorks from "../hooks/useWorks";

export default function HomePage() {
  const works = useWorks();
  return (
    <PageLayout id="galleryMain">
      <Container
        id="galleryGrid"
        as="section"
        role="list"
        aria-label="Works in the exhibition"
      >
        <Row className="g-3">
          {works.map((work) => {
            const workId = work.workInformation.workId;
            const title = work.workInformation.title;
            const coverSrc = work.mediaFilesInformation?.coverImage ?? "";
            const names = (work.entityInformation ?? [])
              .filter((e) => e.entityType !== "group" && e.entityName)
              .map((e) => e.entityName);
            const authorName =
              names.length <= 1
                ? names[0] ?? ""
                : `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;

            return (
              <Col key={workId} xs={12} sm={6} md={4} xl={2} role="listitem">
                <article className="galleryCard h-100">
                  <Link to={`/work/${workId}`} aria-label={`View ${title} by ${authorName}`}>
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
