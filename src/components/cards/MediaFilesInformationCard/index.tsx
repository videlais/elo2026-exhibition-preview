import { Card, Container, Row, Col } from "react-bootstrap";
import { ELMSMediaFilesInformation } from "../../../types/elms/mediaFilesInformation";
import { assetUrl } from "../../../utils/assetUrl";
import {
  MediaFilesInformationPopover,
  CoverImagePopover,
  TraversalVideoPopover,
} from "./Popovers";
import "./index.css";

/**
 * The MediaFilesInformationCard maps to the MediaFilesInformation
 *  object in the ELMS schema.
 */

export default function MediaFilesInformationCard(
  {
    coverImage,
    traversalVideo,
  }: ELMSMediaFilesInformation): JSX.Element {

  return (
    <Card>
      <Card.Header>
        <Card.Title as="h2">Media Files Information <MediaFilesInformationPopover /></Card.Title>
      </Card.Header>
      <Card.Body>
        <Container>
          <Row>
            <Col xs={6} md={6}>
              <div className="coverImage">
                {coverImage && (
                  <>
                    <h3>Cover Image <CoverImagePopover /></h3>
                    <img src={assetUrl(coverImage)} alt="Cover Image" />
                  </>
                )}
              </div>
            </Col>
            <Col xs={6} md={6}>
              <div className="traversalVideo">
                <h3>Traversal Video <TraversalVideoPopover /></h3>
                {traversalVideo ? (
                  <video controls>
                    <source src={assetUrl(traversalVideo)} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <strong>No individual traversal included in current collection. The entry may be a larger sub-collection of works or contain its own recorded traversals.</strong>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </Card.Body>
    </Card>
  );
}
