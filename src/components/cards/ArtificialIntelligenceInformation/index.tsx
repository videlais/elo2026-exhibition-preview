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

  return (
    <Card>
      <Card.Header>
        <Card.Title as="h2">Artificial Intelligence Information <ArtificialIntelligenceInformationPopover /></Card.Title>
      </Card.Header>
      <Card.Body>
        <p><strong>Generated Content:</strong> {generatedContent} <ArtificialIntelligenceGeneratedContentPopover /></p>
        <p><strong>Generated Code:</strong> {generatedCode} <ArtificialIntelligenceGeneratedCodePopover /></p>
        <p><strong>Tools Used:</strong> {toolsUsed} <ArtificialIntelligenceToolsUsedPopover /></p>
        {artificialIntelligenceModelsUsed?.length ? (
          <>
            <p className="mb-1"><strong>Models Used:</strong> <ArtificialIntelligenceModelsUsedPopover /></p>
            <ul>
              {artificialIntelligenceModelsUsed.map((model, index) => (
                <li key={index}>{model}</li>
              ))}
            </ul>
          </>
        ) : (
          <p><strong>Models Used:</strong> None <ArtificialIntelligenceModelsUsedPopover /></p>
        )}
        {artificialIntelligenceExternalLinks?.length ? (
          <>
            <p className="mb-1"><strong>External Links:</strong> <ArtificialIntelligenceExternalLinksPopover /></p>
            <ul>
              {artificialIntelligenceExternalLinks.map((link, index) => (
                <li key={index}>{link}</li>
              ))}
            </ul>
          </>
        ) : (
          <p><strong>External Links:</strong> None <ArtificialIntelligenceExternalLinksPopover /></p>
        )}
      </Card.Body>
    </Card>
  );
}
