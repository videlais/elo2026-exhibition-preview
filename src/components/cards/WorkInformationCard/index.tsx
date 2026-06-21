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
        <Card.Text>
          <em><RichTextBlock content={title ?? ""} /></em>
        </Card.Text>
        <h3>Description <WorkDescriptionPopover /></h3>
        <Card.Text>
          <RichTextBlock content={workDescription ?? ""} />
        </Card.Text>
        {instructions.trim().length > 0 && (
          <>
            <hr />
            <h3>Instructions <InstructionsPopover /></h3>
            <Card.Text id="instructions">
              <RichTextBlock content={instructions ?? ""} />
            </Card.Text>
          </>
        )}
        <h3>Curatorial Statement <CuratorialStatementPopover /></h3>
        <Card.Text id="curatorialStatement">
          <RichTextBlock content={curatorialStatement ?? ""} />
        </Card.Text>
        {documentationLicense.trim().length > 0 && (
          <>
            <hr />
            <h3>Documentation License <DocumentationLicensePopover /></h3>
            <Card.Text id="documentationLicense">
              <RichTextBlock content={documentationLicense ?? ""} />
            </Card.Text>
          </>
        )}
      </Card.Body>
    </Card>
  );
}
