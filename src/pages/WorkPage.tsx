import { useParams } from "react-router-dom";
import { Col, Container, Row } from "react-bootstrap";
import WorkInformationCard from "../components/cards/WorkInformationCard";
import Header from "../components/sections/HeaderSection/Header";
import Footer from "../components/sections/FooterSection/Footer";
import NotFound from "../components/errors/NotFound";
import worksData from "../json/works.json";
import type ELMSWork from "../types/ELMSWork";
import VersionInformationCard from "../components/cards/VersionInformationCard";
import MediaFilesInformationCard from "../components/cards/MediaFilesInformationCard";
import EntityInformationCard from "../components/cards/EnitityInformationCard";
import ArtificialIntelligenceInformationCard from "../components/cards/ArtificialIntelligenceInformation";
import CreatorMetadataInformationCard from "../components/cards/CreatorMetadataCard";
import WorksExternalLinksInformationCard from "../components/cards/WorksExternalLinksInformationCard";

const database = worksData as unknown as ELMSWork[];

export default function WorkPage() {
  const { workId } = useParams();
  const work = database.find((w) => w.workInformation.workId === workId);

  if (!work) return <NotFound />;

  return (
    <>
      <Header />
      <Container role="region" aria-label={`Details for ${work.workInformation.title}`} className="workPage g-3">
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
      </Container>
      <Footer />
    </>
  );
}
