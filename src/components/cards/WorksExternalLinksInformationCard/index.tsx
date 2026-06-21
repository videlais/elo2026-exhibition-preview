import { Card } from "react-bootstrap";
import { ELMSWorksExternalLinksInformation } from "../../../types/elms/worksExternalLinksInformation";
import { WorksExternalLinksInformationPopover } from "./Popovers";

/**
 * The WorksExternalLinksInformationCard maps to the WorksExternalLinksInformation
 *  object in the ELMS schema with the exception of the imageThumbnail field,
 *  which is part of the VersionInformation object.
 */

export default function WorksExternalLinksInformationCard(
  { entities }: { entities: ELMSWorksExternalLinksInformation[] }): JSX.Element {

  return (
    <Card>
      <Card.Header>
        <Card.Title as="h2">External Links <WorksExternalLinksInformationPopover /></Card.Title>
      </Card.Header>
      <Card.Body>
        {entities.map((entity, index) => (
          <ul key={`${index}-${entity.externalLinkId}`}>
            <li>
              <strong>
                <a href={entity.externalLinkUrl}>{entity.externalLinkName}</a>
              </strong>
            </li>
          </ul>
        ))}
      </Card.Body>
    </Card>
  );
}
