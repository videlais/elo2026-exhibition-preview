import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import { InfoCircle } from "react-bootstrap-icons";
import schema from "../../../schema/elms-schema.json";

const { properties: externalLinkProps, description: externalLinksDescription } = schema.properties.worksExternalLinksInformation.items;

const makePopover = (id: string, title: string, description: string) => (
  <Popover id={`popover-${id}`}>
    <Popover.Header as="h3">{title}</Popover.Header>
    <Popover.Body>{description}</Popover.Body>
  </Popover>
);

const InfoTrigger = ({ id, title, description }: { id: string; title: string; description: string }) => (
  <OverlayTrigger trigger="click" placement="right" overlay={makePopover(id, title, description)} rootClose>
    <InfoCircle role="button" style={{ color: "blue", cursor: "pointer" }} tabIndex={0} aria-label={`Info about ${title}`} />
  </OverlayTrigger>
);

export const WorksExternalLinksInformationPopover = () => (
  <InfoTrigger id="worksExternalLinksInformationDescription" title="External Links Description" description={externalLinksDescription} />
);

export const ExternalLinkNamePopover = () => (
  <InfoTrigger id="externalLinkName" title="External Link Name" description={externalLinkProps.externalLinkName.description} />
);

export const ExternalLinkIdPopover = () => (
  <InfoTrigger id="externalLinkId" title="External Link ID" description={externalLinkProps.externalLinkId.description} />
);

export const ExternalLinkUrlPopover = () => (
  <InfoTrigger id="externalLinkUrl" title="External Link URL" description={externalLinkProps.externalLinkUrl.description} />
);
