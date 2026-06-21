import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import { InfoCircle } from "react-bootstrap-icons";
import schema from "../../../schema/elms-schema.json";

const { properties: entityProps } = schema.properties.entityInformation.items;
const { description: entityInformationDescription } = schema.properties.entityInformation;

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

export const EntityInformationPopover = () => (
  <InfoTrigger id="entityInformationDescription" title="Entity Information Description" description={entityInformationDescription} />
);

export const EntityIdPopover = () => (
  <InfoTrigger id="entityId" title="Entity ID" description={entityProps.entityId.description} />
);

export const EntityNamePopover = () => (
  <InfoTrigger id="entityName" title="Entity Name" description={entityProps.entityName.description} />
);

export const NameAuthorityPopover = () => (
  <InfoTrigger id="nameAuthority" title="Name Authority" description={entityProps.nameAuthority.description} />
);

export const EntityTypePopover = () => (
  <InfoTrigger id="entityType" title="Entity Type" description={entityProps.entityType.description} />
);

export const EntityCountryOfOriginPopover = () => (
  <InfoTrigger id="entityCountryOfOrigin" title="Entity Country of Origin" description={entityProps.entityCountryOfOrigin.description} />
);

export const RolePopover = () => (
  <InfoTrigger id="role" title="Role" description={entityProps.role.description} />
);

export const RoleAbbreviationPopover = () => (
  <InfoTrigger id="roleAbbreviation" title="Role Abbreviation" description={entityProps.roleAbbreviation.description} />
);

export const PrimaryRolePopover = () => (
  <InfoTrigger id="primaryRole" title="Primary Role" description={entityProps.primaryRole.description} />
);

export const RolePseudonymPopover = () => (
  <InfoTrigger id="rolePseudonym" title="Role Pseudonym" description={entityProps.rolePseudonym.description} />
);

export const EntityRoleIdPopover = () => (
  <InfoTrigger id="entityRoleId" title="Entity Role ID" description={entityProps.entityRoleId.description} />
);
