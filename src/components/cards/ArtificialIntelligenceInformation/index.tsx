import { Card } from "react-bootstrap";
import { ELMSArtificialIntelligenceInformation } from "../../../types/elms/artificialIntelligenceInformation";
import {
  ArtificialIntelligenceInformationPopover,
  ArtificialIntelligenceGeneratedContentPopover,
  ArtificialIntelligenceGeneratedCodePopover,
  ArtificialIntelligenceToolsUsedPopover,
  ArtificialIntelligenceModelsUsedPopover,
  ArtificialIntelligenceExternalLinksPopover,
} from "./Popovers";

/**
 * The ArtificialIntelligenceInformationCard maps to the ELMSArtificialIntelligenceInformation
 *  object in the ELMS schema.
 */

export default function ArtificialIntelligenceInformationCard(
  {
    artificialIntelligenceGeneratedContent,
    artificialIntelligenceGeneratedCode,
    artificialIntelligenceToolsUsed,
    artificialIntelligenceModelsUsed,
    artificialIntelligenceExternalLinks,
  }: ELMSArtificialIntelligenceInformation,
): JSX.Element {

  // Process the fields because of the use of boolean and array values.

  const generatedContent = artificialIntelligenceGeneratedContent !== undefined ? String(artificialIntelligenceGeneratedContent) : "None";

  const generatedCode = artificialIntelligenceGeneratedCode !== undefined ? String(artificialIntelligenceGeneratedCode) : "None";

  const toolsUsed = artificialIntelligenceToolsUsed?.length ? artificialIntelligenceToolsUsed.join(", ") : "None";

  const modelsUsed = artificialIntelligenceModelsUsed?.length ? artificialIntelligenceModelsUsed.join(", ") : "None";

  const externalLinks = artificialIntelligenceExternalLinks?.length ? artificialIntelligenceExternalLinks.join(", ") : "None";

  return (
    <Card className="elcCard titleCard">
      <Card.Header>
        <Card.Title as="h2">Artificial Intelligence Information <ArtificialIntelligenceInformationPopover /></Card.Title>
      </Card.Header>
      <Card.Body className="elcCardBody">
        <p><strong>Generated Content:</strong> {generatedContent} <ArtificialIntelligenceGeneratedContentPopover /></p>
        <p><strong>Generated Code:</strong> {generatedCode} <ArtificialIntelligenceGeneratedCodePopover /></p>
        <p><strong>Tools Used:</strong> {toolsUsed} <ArtificialIntelligenceToolsUsedPopover /></p>
        <p><strong>Models Used:</strong> {modelsUsed} <ArtificialIntelligenceModelsUsedPopover /></p>
        <p><strong>External Links:</strong> {externalLinks} <ArtificialIntelligenceExternalLinksPopover /></p>
      </Card.Body>
    </Card>
  );
}
