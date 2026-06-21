import { Card } from "react-bootstrap";
import { ELMSWorkInformation } from "../../../types/elms/workInformation";
import { RichTextBlock } from "../../../utils/richText";
import {
  WorkInformationPopover,
  WorkDescriptionPopover,
  CuratorialStatementPopover,
  InstructionsPopover,
  DocumentationLicensePopover,
} from "./Popovers";

/**
 * The WorkInformationCard maps to the WorkInformation
 *  object in the ELMS schema with the exception of the imageThumbnail field,
 *  which is part of the VersionInformation object.
 */

export default function WorkInformationCard(
  {
    title,
    workId,
    workDescription,
    curatorialStatement,
    instructions,
    documentationLicense,
  }: ELMSWorkInformation): JSX.Element {

  return (
    <Card key={workId}>
      <Card.Header>
        <Card.Title as="h2">Work Information <WorkInformationPopover /></Card.Title>
      </Card.Header>
      <Card.Body>
        <h3>Title</h3>
        <RichTextBlock className="card-text fst-italic" content={title ?? ""} />
        <h3>Description <WorkDescriptionPopover /></h3>
        <RichTextBlock className="card-text" content={workDescription ?? ""} />
        {instructions.trim().length > 0 && (
          <>
            <hr />
            <h3>Instructions <InstructionsPopover /></h3>
            <RichTextBlock id="instructions" className="card-text" content={instructions ?? ""} />
          </>
        )}
        <h3>Curatorial Statement <CuratorialStatementPopover /></h3>
        <RichTextBlock id="curatorialStatement" className="card-text" content={curatorialStatement ?? ""} />
        {documentationLicense.trim().length > 0 && (
          <>
            <hr />
            <h3>Documentation License <DocumentationLicensePopover /></h3>
            <RichTextBlock id="documentationLicense" className="card-text" content={documentationLicense ?? ""} />
          </>
        )}
      </Card.Body>
    </Card>
  );
}
