import { Card } from "react-bootstrap";
import { ELMSCreatorMetadataInformation } from "../../../types/elms/creatorMetadataInformation";
import { RichTextBlock } from "../../../utils/richText";
import {
  CreatorMetadataInformationPopover,
  CreatorKeywordsPopover,
  CreatorBiographyPopover,
} from "./Popovers";

/**
 * The CreatorMetadataInformationCard maps to the ELMSCreatorMetadataInformation
 *  object in the ELMS schema.
 */

export default function CreatorMetadataInformationCard(
  {
    creatorKeywords,
    creatorBiography,
  }: ELMSCreatorMetadataInformation,
): JSX.Element {

  return (
    <Card className="elcCard titleCard">
      <Card.Header>
        <Card.Title as="h2">Creator Metadata Information <CreatorMetadataInformationPopover /></Card.Title>
      </Card.Header>
      <Card.Body className="elcCardBody">
        <h3>Biography <CreatorBiographyPopover /></h3>
        <p><RichTextBlock content={creatorBiography ?? ""} /></p>
        {creatorKeywords && creatorKeywords.length > 0 && (
          <>
            <h3>Keywords <CreatorKeywordsPopover /></h3>
            <ul>
              {creatorKeywords.map((keyword, index) => (
                <li key={index}>{keyword}</li>
              ))}
            </ul>
          </>
        )}
      </Card.Body>
    </Card>
  );
}
