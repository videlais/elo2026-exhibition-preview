import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import { InfoCircle } from "react-bootstrap-icons";
import schema from "../../../schema/elms-schema.json";

const { properties: creatorProps } = schema.properties.creatorMetadataInformation;
const { description: creatorMetadataDescription } = schema.properties.creatorMetadataInformation;

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

export const CreatorMetadataInformationPopover = () => (
  <InfoTrigger id="creatorMetadataInformation" title="Creator Metadata Information" description={creatorMetadataDescription} />
);

export const CreatorKeywordsPopover = () => (
  <InfoTrigger id="creatorKeywords" title="Creator Keywords" description={creatorProps.creatorKeywords.description} />
);

export const CreatorBiographyPopover = () => (
  <InfoTrigger id="creatorBiography" title="Creator Biography" description={creatorProps.creatorBiography.description} />
);
