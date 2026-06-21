import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Col, Container, Row } from "react-bootstrap";
import WorkInformationCard from "../components/cards/WorkInformationCard";
import PageLayout from "../components/PageLayout";
import NotFound from "../components/errors/NotFound";
import useWorks from "../hooks/useWorks";
import VersionInformationCard from "../components/cards/VersionInformationCard";
import MediaFilesInformationCard from "../components/cards/MediaFilesInformationCard";
import EntityInformationCard from "../components/cards/EntityInformationCard";
import ArtificialIntelligenceInformationCard from "../components/cards/ArtificialIntelligenceInformation";
import CreatorMetadataInformationCard from "../components/cards/CreatorMetadataCard";
import WorksExternalLinksInformationCard from "../components/cards/WorksExternalLinksInformationCard";
import CitationModal from "../components/modals/CitationModal";
import { buildWorkCitation, getWorkCiteKey } from "../constants/workCitation";

export default function WorkPage() {
  const { workId } = useParams();
  const works = useWorks();
  const work = works.find((w) => w.workInformation.workId === workId);
  const [showCitation, setShowCitation] = useState(false);

  if (!work) return <NotFound />;

  const publicUrl = typeof window !== "undefined" ? window.location.href : "";
  const citation = buildWorkCitation(work, publicUrl);
  const citeKey = getWorkCiteKey(work);

  return (
    <PageLayout ariaLabel={`Details for ${work.workInformation.title}`}>
      <Container className="workPage g-3">
        {/* Row 1: Work Information */}
        <Row className="g-3">
          <Col xs={12}>
            <WorkInformationCard {...work.workInformation} />
          </Col>
        </Row>
        {/* Row 2: Media Files */}
        <Row className="g-3">
          <Col xs={12}>
            <MediaFilesInformationCard {...work.mediaFilesInformation} />
          </Col>
        </Row>
        {/* Row 3: Entity + Creator Metadata */}
        <Row className="g-3">
          <Col xs={12} md={6}>
            {work.entityInformation && <EntityInformationCard entities={work.entityInformation} />}
          </Col>
          <Col xs={12} md={6}>
            {work.creatorMetadataInformation && <CreatorMetadataInformationCard {...work.creatorMetadataInformation} />}
          </Col>
        </Row>
        {/* Row 4: Version Information */}
        <Row className="g-3">
          <Col xs={12} md={6}>
            <VersionInformationCard {...work.versionInformation} />
          </Col>
          <Col xs={12} md={6}>
            <ArtificialIntelligenceInformationCard {...work.artificialIntelligenceInformation} />
          </Col>
        </Row>
        {/* Row 5: AI Information + External Links */}
        <Row className="g-3">
          <Col xs={12} md={12}>
            {work.worksExternalLinksInformation && <WorksExternalLinksInformationCard entities={work.worksExternalLinksInformation} />}
          </Col>
        </Row>
         <Row className="g-3">
          <Col xs={12} className="d-flex justify-content-end">
            <Button
              size="sm"
              variant="outline-primary"
              aria-haspopup="dialog"
              onClick={() => setShowCitation(true)}
            >
              Cite this work
            </Button>
          </Col>
        </Row>
      </Container>
      <CitationModal
        show={showCitation}
        onHide={() => setShowCitation(false)}
        title={`Cite "${work.workInformation.title}"`}
        citeKey={citeKey}
        citation={citation}
      />
    </PageLayout>
  );
}
