import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import { InfoCircle } from "react-bootstrap-icons";
import schema from "../../../schema/elms-schema.json";

const { properties: mediaFilesProps } = schema.properties.mediaFilesInformation;
const { description: mediaFilesInformationDescription } = schema.properties.mediaFilesInformation;

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

export const MediaFilesInformationPopover = () => (
  <InfoTrigger id="mediaFilesInformationDescription" title="Media Files Information Description" description={mediaFilesInformationDescription} />
);

export const CoverImagePopover = () => (
  <InfoTrigger id="coverImage" title="Cover Image" description={mediaFilesProps.coverImage.description} />
);

export const TraversalVideoPopover = () => (
  <InfoTrigger id="traversalVideo" title="Traversal Video" description={mediaFilesProps.traversalVideo.description} />
);
