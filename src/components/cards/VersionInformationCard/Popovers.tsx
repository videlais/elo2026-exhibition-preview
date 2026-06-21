import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import { InfoCircle } from 'react-bootstrap-icons';
import schema from "../../../schema/elms-schema.json";

const { properties: versionProps } = schema.properties.versionInformation;
const { description: versionInformationDescription } = schema.properties.versionInformation;

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

export const VersionInformationPopover = () => (
  <InfoTrigger id="versionInformation" title="Version Information" description={versionInformationDescription} />
);

export const VersionPopover = () => (
  <InfoTrigger id="version" title="Version" description={versionProps.version.description} />
);

export const VersionIdPopover = () => (
  <InfoTrigger id="versionId" title="Version ID" description={versionProps.versionId.description} />
);

export const VersionNumberPopover = () => (
  <InfoTrigger id="versionNumber" title="Version Number" description={versionProps.versionNumber.description} />
);

export const VersionLetterPopover = () => (
  <InfoTrigger id="versionLetter" title="Version Letter" description={versionProps.versionLetter.description} />
);

export const ImageThumbnailPopover = () => (
  <InfoTrigger id="imageThumbnail" title="Image Thumbnail" description={versionProps.imageThumbnail.description} />
);

export const OriginalPublicationStatusPopover = () => (
  <InfoTrigger id="originalPublicationStatus" title="Original Publication Status" description={versionProps.originalPublicationStatus.description} />
);

export const IncompletePopover = () => (
  <InfoTrigger id="incomplete" title="Incomplete" description={versionProps.incomplete.description} />
);

export const AuthorialVersionPopover = () => (
  <InfoTrigger id="authorialVersion" title="Authorial Version" description={versionProps.authorialVersion.description} />
);

export const OriginalPublicationMonthPopover = () => (
  <InfoTrigger id="originalPublicationMonth" title="Original Publication Month" description={versionProps.originalPublicationMonth.description} />
);

export const OriginalPublicationYearPopover = () => (
  <InfoTrigger id="originalPublicationYear" title="Original Publication Year" description={versionProps.originalPublicationYear.description} />
);

export const OriginalPublicationTypePopover = () => (
  <InfoTrigger id="originalPublicationType" title="Original Publication Type" description={versionProps.originalPublicationType.description} />
);

export const OriginalPublisherPopover = () => (
  <InfoTrigger id="originalPublisher" title="Original Publisher" description={versionProps.originalPublisher.description} />
);

export const OriginalPublisherAuthorityPopover = () => (
  <InfoTrigger id="originalPublisherAuthority" title="Original Publisher Authority" description={versionProps.originalPublisherAuthority.description} />
);

export const OriginalVolumePopover = () => (
  <InfoTrigger id="originalVolume" title="Original Volume" description={versionProps.originalVolume.description} />
);

export const OriginalIssuePopover = () => (
  <InfoTrigger id="originalIssue" title="Original Issue" description={versionProps.originalIssue.description} />
);

export const OriginalMediaFormatPopover = () => (
  <InfoTrigger id="originalMediaFormat" title="Original Media Format" description={versionProps.originalMediaFormat.description} />
);

export const PublicationMonthPopover = () => (
  <InfoTrigger id="publicationMonth" title="Publication Month" description={versionProps.publicationMonth.description} />
);

export const PublicationYearPopover = () => (
  <InfoTrigger id="publicationYear" title="Publication Year" description={versionProps.publicationYear.description} />
);

export const SoftwareDependenciesPopover = () => (
  <InfoTrigger id="softwareDependencies" title="Software Dependencies" description={versionProps.softwareDependencies.description} />
);

export const AuthoringPlatformPopover = () => (
  <InfoTrigger id="authoringPlatform" title="Authoring Platform" description={versionProps.authoringPlatform.description} />
);

export const HardwareDependenciesPopover = () => (
  <InfoTrigger id="hardwareDependencies" title="Hardware Dependencies" description={versionProps.hardwareDependencies.description} />
);

export const PeripheralDependenciesPopover = () => (
  <InfoTrigger id="peripheralDependencies" title="Peripheral Dependencies" description={versionProps.peripheralDependencies.description} />
);

export const ComputerLanguagesPopover = () => (
  <InfoTrigger id="computerLanguages" title="Computer Languages" description={versionProps.computerLanguages.description} />
);

export const DigitalQualitiesPopover = () => (
  <InfoTrigger id="digitalQualities" title="Digital Qualities" description={versionProps.digitalQualities.description} />
);

export const SensoryModalitiesPopover = () => (
  <InfoTrigger id="sensoryModalities" title="Sensory Modalities" description={versionProps.sensoryModalities.description} />
);

export const GenresPopover = () => (
  <InfoTrigger id="genres" title="Genres" description={versionProps.genres.description} />
);

export const LanguagesPopover = () => (
  <InfoTrigger id="languages" title="Languages" description={versionProps.languages.description} />
);

export const AccessibilityPopover = () => (
  <InfoTrigger id="accessibility" title="Accessibility" description={versionProps.accessibility.description} />
);

export const RightsNoticePopover = () => (
  <InfoTrigger id="rightsNotice" title="Rights Notice" description={versionProps.rightsNotice.description} />
);

export const EldLinkPopover = () => (
  <InfoTrigger id="eldLink" title="ELD Link" description={versionProps.eldLink.description} />
);

export const ElmcipLinkPopover = () => (
  <InfoTrigger id="elmcipLink" title="ELMCIP Link" description={versionProps.elmcipLink.description} />
);

export const RebootingElectronicLiteratureLinkPopover = () => (
  <InfoTrigger id="rebootingElectronicLiteratureLink" title="Rebooting Electronic Literature Link" description={versionProps.rebootingElectronicLiteratureLink.description} />
);
