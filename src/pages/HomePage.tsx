import { Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import Header from "../components/sections/HeaderSection/Header";
import Footer from "../components/sections/FooterSection/Footer";
import worksData from "../json/works.json";
import type ELMSWork from "../types/ELMSWork";

const works = worksData as unknown as ELMSWork[];

export default function HomePage() {
  return (
    <>
      <Header />
      <main id="galleryMain" role="main">
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
              const authorName = work.entityInformation
                ? work.entityInformation.find((e) => e.primaryRole)?.entityName ?? work.entityInformation[0]?.entityName ?? ""
                : "";

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
      </main>
      <Footer />
    </>
  );
}
