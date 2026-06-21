import { Card } from "react-bootstrap";
import { ELMSMediaFilesInformation } from "../../../types/elms/mediaFilesInformation";
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
    <Card className="elcCard titleCard">
      <Card.Header>
        <Card.Title as="h2">Media Files</Card.Title>
      </Card.Header>
      <Card.Body className="elcCardBody">
        <div className="coverImage">
          {coverImage && (
            <>
              <h3>Cover Image</h3>
              <img src={coverImage} alt="Cover Image" />
            </>
          )}
        </div>
        <div className="traversalVideo">
          <h3>Traversal Video</h3>
          {traversalVideo && (
            <>
              <video controls>
                <source src={traversalVideo} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </>
          ) ? undefined : (<><strong>No traversal included.</strong></>)}
        </div>
      </Card.Body>
    </Card>
  );
}
