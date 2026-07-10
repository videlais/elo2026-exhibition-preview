import { useParams } from "react-router-dom";
import { Col, Container, Row } from "react-bootstrap";
import WorkInformationCard from "../components/cards/WorkInformationCard";
import PageLayout from "../components/PageLayout";
import NotFound from "../components/errors/NotFound";
import useWorks from "../hooks/useWorks";
import VersionInformationCard from "../components/cards/VersionInformationCard";
import AccessibilityInformationCard from "../components/cards/AccessibilityInformationCard";
import MediaFilesInformationCard from "../components/cards/MediaFilesInformationCard";
import EntityInformationCard from "../components/cards/EntityInformationCard";
import ArtificialIntelligenceInformationCard from "../components/cards/ArtificialIntelligenceInformation";
import CreatorMetadataInformationCard from "../components/cards/CreatorMetadataCard";
import WorksExternalLinksInformationCard from "../components/cards/WorksExternalLinksInformationCard";
import CitationCard from "../components/cards/CitationCard";

export default function WorkPage() {
  const { workId } = useParams();
  const works = useWorks();
  const work = works.find((w) => w.workInformation.workId === workId);

  if (!work) return <NotFound />;

  return (
    <PageLayout ariaLabel={`Details for ${work.workInformation.title}`}>
      <Container className="workPage g-3">

        <Row className="g-3">
          <Col xs={12} md={12}>
            <WorkInformationCard {...work.workInformation} />
          </Col>
        </Row>

        <Row className="g-3">
          <Col xs={12} md={12}>
            <MediaFilesInformationCard {...work.mediaFilesInformation} />
          </Col>
        </Row>

        <Row className="g-3">
          <Col xs={12} md={12}>
            {work.entityInformation && <EntityInformationCard entities={work.entityInformation} />}
          </Col>
        </Row>

        <Row className="g-3">
          <Col xs={12} md={12}>
            {work.creatorMetadataInformation && <CreatorMetadataInformationCard {...work.creatorMetadataInformation} />}
          </Col>
        </Row>

        <Row className="g-3">
          <Col xs={12} md={12}>
            <VersionInformationCard {...work.versionInformation} />
          </Col>
        </Row>

        <Row className="g-3">
          <Col xs={12} md={12}>
            <AccessibilityInformationCard {...work.accessibilityInformation} />
          </Col>
        </Row>

        <Row className="g-3">
          <Col xs={12} md={12}>
            <ArtificialIntelligenceInformationCard {...work.artificialIntelligenceInformation} />
          </Col>
        </Row>

        <Row className="g-3">
          <Col xs={12} md={12}>
            {work.worksExternalLinksInformation && <WorksExternalLinksInformationCard entities={work.worksExternalLinksInformation} />}
          </Col>
        </Row>

        <Row className="g-3">
          <Col xs={12} md={12}>
            <CitationCard {...work} />
          </Col>
        </Row>

      </Container>
    </PageLayout>
  );
}
