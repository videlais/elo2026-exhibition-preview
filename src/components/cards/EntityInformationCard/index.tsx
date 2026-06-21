import { Card } from "react-bootstrap";
import { ELMSEntityInformation } from "../../../types/elms/entityInformation";
import {
  EntityInformationPopover,
  EntityIdPopover,
  EntityNamePopover,
  NameAuthorityPopover,
  EntityTypePopover,
  EntityCountryOfOriginPopover,
  RolePopover,
  RoleAbbreviationPopover,
  PrimaryRolePopover,
  RolePseudonymPopover,
  EntityRoleIdPopover,
} from "./Popovers";

/**
 * The EntityInformationCard maps to the ELMSEntityInformation
 *  object in the ELMS schema.
 */

export default function EntityInformationCard(
  { entities }: { entities: ELMSEntityInformation[] },
): JSX.Element {

  return (
    <Card>
      <Card.Header>
        <Card.Title as="h2">Entity Information <EntityInformationPopover /></Card.Title>
      </Card.Header>
      <Card.Body>
        {entities.map((entity) => (
          <ul key={entity.entityRoleId ?? entity.entityId}>
            {entity.entityName && <li className="mb-2"><strong>Entity Name:</strong> {entity.entityName} <EntityNamePopover /></li>}
            {entity.entityId && <li className="mb-2"><strong>Entity ID:</strong> {entity.entityId} <EntityIdPopover /></li>}
            {entity.nameAuthority && <li className="mb-2"><strong>Name Authority:</strong> {entity.nameAuthority} <NameAuthorityPopover /></li>}
            {entity.entityType && <li className="mb-2"><strong>Entity Type:</strong> {entity.entityType} <EntityTypePopover /></li>}
            {entity.entityCountryOfOrigin && <li className="mb-2"><strong>Country of Origin:</strong> {entity.entityCountryOfOrigin} <EntityCountryOfOriginPopover /></li>}
            {entity.role && <li className="mb-2"><strong>Role:</strong> {entity.role} <RolePopover /></li>}
            {entity.roleAbbreviation && <li className="mb-2"><strong>Role Abbreviation:</strong> {entity.roleAbbreviation} <RoleAbbreviationPopover /></li>}
            {entity.primaryRole && <li className="mb-2"><strong>Primary Role:</strong> {String(entity.primaryRole)} <PrimaryRolePopover /></li>}
            {entity.rolePseudonym && <li className="mb-2"><strong>Role Pseudonym:</strong> {entity.rolePseudonym} <RolePseudonymPopover /></li>}
            {entity.entityRoleId && <li className="mb-2"><strong>Entity Role ID:</strong> {entity.entityRoleId} <EntityRoleIdPopover /></li>}
          </ul>
        ))}
      </Card.Body>
    </Card>
  );
}
