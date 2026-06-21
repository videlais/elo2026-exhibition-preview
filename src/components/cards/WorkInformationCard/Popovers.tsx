import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import { InfoCircle } from 'react-bootstrap-icons';
import schema from "../../../schema/elms-schema.json";

const { properties: workProps } = schema.properties.workInformation;
const { description: workInformationDescription } = schema.properties.workInformation;

const makePopover = (id: string, title: string, description: string) => (
  <Popover id={`popover-${id}`}>
    <Popover.Header as="h3">{title}</Popover.Header>
    <Popover.Body>{description}</Popover.Body>
  </Popover>
);

const InfoTrigger = ({ id, title, description }: { id: string; title: string; description: string }) => (
  <OverlayTrigger trigger="click" placement="right" overlay={makePopover(id, title, description)} rootClose>
    <InfoCircle role="button" style={{ color: 'blue', cursor: 'pointer' }} tabIndex={0} aria-label={`Info about ${title}`} />
  </OverlayTrigger>
);

export const WorkInformationPopover = () => (
  <InfoTrigger id="workInformation" title="Work Information" description={workInformationDescription} />
);

export const TitlePopover = () => (
  <InfoTrigger id="title" title="Title" description={workProps.title.description} />
);

export const WorkIdPopover = () => (
  <InfoTrigger id="workId" title="Work ID" description={workProps.workId.description} />
);

export const WorkDescriptionPopover = () => (
  <InfoTrigger id="workDescription" title="Work Description" description={workProps.workDescription.description} />
);

export const CuratorialStatementPopover = () => (
  <InfoTrigger id="curatorialStatement" title="Curatorial Statement" description={workProps.curatorialStatement.description} />
);

export const InstructionsPopover = () => (
  <InfoTrigger id="instructions" title="Instructions" description={workProps.instructions.description} />
);

export const DocumentationLicensePopover = () => (
  <InfoTrigger id="documentationLicense" title="Documentation License" description={workProps.documentationLicense.description} />
);
