import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import { InfoCircle } from 'react-bootstrap-icons';
import schema from "../../../schema/elms-schema.json";

const { properties: aiProps } = schema.properties.artificialIntelligenceInformation;
const { description: aiInformationDescription } = schema.properties.artificialIntelligenceInformation;

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

export const ArtificialIntelligenceInformationPopover = () => (
  <InfoTrigger id="artificialIntelligenceInformation" title="Artificial Intelligence Information" description={aiInformationDescription} />
);

export const ArtificialIntelligenceGeneratedContentPopover = () => (
  <InfoTrigger id="artificialIntelligenceGeneratedContent" title="AI Generated Content" description={aiProps.artificialIntelligenceGeneratedContent.description} />
);

export const ArtificialIntelligenceGeneratedCodePopover = () => (
  <InfoTrigger id="artificialIntelligenceGeneratedCode" title="AI Generated Code" description={aiProps.artificialIntelligenceGeneratedCode.description} />
);

export const ArtificialIntelligenceToolsUsedPopover = () => (
  <InfoTrigger id="artificialIntelligenceToolsUsed" title="AI Tools Used" description={aiProps.artificialIntelligenceToolsUsed.description} />
);

export const ArtificialIntelligenceModelsUsedPopover = () => (
  <InfoTrigger id="artificialIntelligenceModelsUsed" title="AI Models Used" description={aiProps.artificialIntelligenceModelsUsed.description} />
);

export const ArtificialIntelligenceExternalLinksPopover = () => (
  <InfoTrigger id="artificialIntelligenceExternalLinks" title="AI External Links" description={aiProps.artificialIntelligenceExternalLinks.description} />
);
