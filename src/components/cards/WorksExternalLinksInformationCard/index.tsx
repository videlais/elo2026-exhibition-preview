import { Card } from "react-bootstrap";
import { ELMSWorksExternalLinksInformation } from "../../../types/elms/worksExternalLinksInformation";

/**
 * The WorksExternalLinksInformationCard maps to the WorksExternalLinksInformation 
 *  object in the ELMS schema with the exception of the imageThumbnail field, 
 *  which is part of the VersionInformation object.
 */

export default function WorksExternalLinksInformationCard(
  { entities }: { entities: ELMSWorksExternalLinksInformation[] }): JSX.Element {

  return (
    <Card className="elcCard titleCard">
      <Card.Header className="elcCardHeader">
        <Card.Title as="h2">External Links</Card.Title>
      </Card.Header>
      <Card.Body className="elcCardBody">
        {entities.map((entity) => (
             <ul key={entity.externalLinkId ?? entity.externalLinkUrl}>
                {entity.externalLinkName && <li><strong>External Link Name:</strong> {entity.externalLinkName}</li>}
                {entity.externalLinkUrl && <li><strong>External Link URL:</strong> {entity.externalLinkUrl}</li>}
             </ul>
        ))}
      </Card.Body>
    </Card>
  );
}
