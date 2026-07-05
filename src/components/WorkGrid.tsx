import { Link } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import type ELMSWork from "../types/ELMSWork";
import { assetUrl } from "../utils/assetUrl";
import { workAuthorName } from "../utils/works";

interface WorkGridProps {
  works: ELMSWork[];
  ariaLabel: string;
}

/** Shared gallery grid of work cards, used by the home, search, and playlist views. */
export default function WorkGrid({ works, ariaLabel }: WorkGridProps) {
  return (
    <Row className="g-3" role="list" aria-label={ariaLabel}>
      {works.map((work) => {
        const workId = work.workInformation.workId;
        const title = work.workInformation.title;
        const coverSrc = assetUrl(work.mediaFilesInformation?.coverImage);
        const authorName = workAuthorName(work);
        return (
          <Col key={workId} xs={12} sm={6} md={4} xl={2} role="listitem">
            <article className="galleryCard h-100">
              <Link
                to={`/work/${workId}`}
                aria-label={
                  authorName ? `View ${title} by ${authorName}` : `View ${title}`
                }
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
  );
}
