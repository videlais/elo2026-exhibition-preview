import { Card } from "react-bootstrap";
import "./index.css";
import { ELMSVersionInformation } from "../../../types/elms/versionInformation";
import {
  VersionInformationPopover,
  VersionPopover,
  VersionIdPopover,
  VersionNumberPopover,
  VersionLetterPopover,
  OriginalPublicationStatusPopover,
  IncompletePopover,
  AuthorialVersionPopover,
  OriginalPublicationMonthPopover,
  OriginalPublicationYearPopover,
  OriginalPublicationTypePopover,
  OriginalPublisherPopover,
  OriginalPublisherAuthorityPopover,
  OriginalVolumePopover,
  OriginalIssuePopover,
  OriginalMediaFormatPopover,
  PublicationMonthPopover,
  PublicationYearPopover,
  SoftwareDependenciesPopover,
  AuthoringPlatformPopover,
  HardwareDependenciesPopover,
  PeripheralDependenciesPopover,
  ComputerLanguagesPopover,
  DigitalQualitiesPopover,
  SensoryModalitiesPopover,
  GenresPopover,
  LanguagesPopover,
  AccessibilityPopover,
  RightsNoticePopover,
  EldLinkPopover,
  ElmcipLinkPopover,
  RebootingElectronicLiteratureLinkPopover,
} from "./Popovers";

/**
 * The VersionInformationCard maps to the VersionInformation
 *  object in the ELMS schema, which provides detailed information about a specific version of a work,
 *  including its version number, release date, and other relevant details.
 */

export default function VersionInformationCard(
  {
    version,
    versionId,
    versionNumber,
    versionLetter,
    originalPublicationStatus,
    incomplete,
    authorialVersion,
    originalPublicationMonth,
    originalPublicationYear,
    originalPublicationType,
    originalPublisher,
    originalPublisherAuthority,
    originalVolume,
    originalIssue,
    originalMediaFormat,
    publicationMonth,
    publicationYear,
    softwareDependencies,
    authoringPlatform,
    hardwareDependencies,
    peripheralDependencies,
    computerLanguages,
    digitalQualities,
    sensoryModalities,
    genres,
    languages,
    accessibility,
    rightsNotice,
    eldLink,
    elmcipLink,
    rebootingElectronicLiteratureLink,
  }: ELMSVersionInformation): JSX.Element {

  return (
    <Card>
      <Card.Header>
        <Card.Title as="h2">Version Information <VersionInformationPopover /></Card.Title>
      </Card.Header>
      <Card.Body className="elcCardBody">
        <ul>
          <li className="mb-2"><strong>Version:</strong> {version} <VersionPopover /></li>
          <li className="mb-2"><strong>Version ID:</strong> {versionId} <VersionIdPopover /></li>

          {versionNumber && <li className="mb-2"><strong>Version Number:</strong> {versionNumber} <VersionNumberPopover /></li>}

          {versionLetter && <li className="mb-2"><strong>Version Letter:</strong> {versionLetter} <VersionLetterPopover /></li>}

          {originalPublicationStatus && <li className="mb-2"><strong>Original Publication Status:</strong> {originalPublicationStatus} <OriginalPublicationStatusPopover /></li>}

          {incomplete !== undefined && <li className="mb-2"><strong>Incomplete:</strong> {incomplete ? "Yes" : "No"} <IncompletePopover /></li>}

          {authorialVersion !== undefined && <li className="mb-2"><strong>Authorial Version:</strong> {authorialVersion ? "Yes" : "No"} <AuthorialVersionPopover /></li>}

          {originalPublicationMonth && <li className="mb-2"><strong>Original Publication Month:</strong> {originalPublicationMonth} <OriginalPublicationMonthPopover /></li>}

          {originalPublicationYear && <li className="mb-2"><strong>Original Publication Year:</strong> {originalPublicationYear} <OriginalPublicationYearPopover /></li>}

          {originalPublicationType && <li className="mb-2"><strong>Original Publication Type:</strong> {originalPublicationType} <OriginalPublicationTypePopover /></li>}

          {originalPublisher && <li className="mb-2"><strong>Original Publisher:</strong> {originalPublisher} <OriginalPublisherPopover /></li>}

          {originalPublisherAuthority && <li className="mb-2"><strong>Original Publisher Authority:</strong> <a href={originalPublisherAuthority}>{originalPublisherAuthority}</a> <OriginalPublisherAuthorityPopover /></li>}

          {originalVolume && <li className="mb-2"><strong>Original Volume:</strong> {originalVolume} <OriginalVolumePopover /></li>}

          {originalIssue && <li className="mb-2"><strong>Original Issue:</strong> {originalIssue} <OriginalIssuePopover /></li>}

          {originalMediaFormat && <li className="mb-2"><strong>Original Media Format:</strong> {originalMediaFormat} <OriginalMediaFormatPopover /></li>}

          {publicationMonth && <li className="mb-2"><strong>Publication Month:</strong> {publicationMonth} <PublicationMonthPopover /></li>}

          {publicationYear && <li className="mb-2"><strong>Publication Year:</strong> {publicationYear} <PublicationYearPopover /></li>}

          {softwareDependencies && softwareDependencies.length > 0 && <li className="mb-2"><strong>Software Dependencies:</strong> {softwareDependencies.join(", ")} <SoftwareDependenciesPopover /></li>}

          {authoringPlatform && <li className="mb-2"><strong>Authoring Platform:</strong> {authoringPlatform} <AuthoringPlatformPopover /></li>}

          {hardwareDependencies && hardwareDependencies.length > 0 && <li className="mb-2"><strong>Hardware Dependencies:</strong> {hardwareDependencies.join(", ")} <HardwareDependenciesPopover /></li>}

          {peripheralDependencies && peripheralDependencies.length > 0 && <li className="mb-2"><strong>Peripheral Dependencies:</strong> {peripheralDependencies.join(", ")} <PeripheralDependenciesPopover /></li>}

          {computerLanguages && computerLanguages.length > 0 && <li className="mb-2"><strong>Computer Languages:</strong> {computerLanguages.join(", ")} <ComputerLanguagesPopover /></li>}

          {digitalQualities && digitalQualities.length > 0 && <li className="mb-2"><strong>Digital Qualities:</strong> {digitalQualities.join(", ")} <DigitalQualitiesPopover /></li>}

          {sensoryModalities && sensoryModalities.length > 0 && <li className="mb-2"><strong>Sensory Modalities:</strong> {sensoryModalities.join(", ")} <SensoryModalitiesPopover /></li>}

          {genres && genres.length > 0 && <li className="mb-2"><strong>Genres:</strong> {genres.join(", ")} <GenresPopover /></li>}

          {languages && languages.length > 0 && <li className="mb-2"><strong>Languages:</strong> {languages.join(", ")} <LanguagesPopover /></li>}

          {accessibility && <li className="mb-2"><strong>Accessibility:</strong> {accessibility} <AccessibilityPopover /></li>}

          {rightsNotice && <li className="mb-2"><strong>Rights Notice:</strong> {rightsNotice} <RightsNoticePopover /></li>}

          {eldLink && <li className="mb-2"><strong>ELD Link:</strong> <a href={eldLink}>{eldLink}</a> <EldLinkPopover /></li>}

          {elmcipLink && <li className="mb-2"><strong>ELMCIP Link:</strong> <a href={elmcipLink}>{elmcipLink}</a> <ElmcipLinkPopover /></li>}

          {rebootingElectronicLiteratureLink && <li className="mb-2"><strong>Rebooting Electronic Literature Link:</strong> <a href={rebootingElectronicLiteratureLink}>{rebootingElectronicLiteratureLink}</a> <RebootingElectronicLiteratureLinkPopover /></li>}
        </ul>
      </Card.Body>
    </Card>
  );
}
