import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import { InfoCircle } from "react-bootstrap-icons";
import schema from "../../../schema/elms-schema.json";

const { properties: accessibilityProps } = schema.properties.accessibilityInformation;
const { description: accessibilityInformationDescription } = schema.properties.accessibilityInformation;

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

export const AccessibilityInformationPopover = () => (
  <InfoTrigger id="accessibilityInformation" title="Accessibility Information" description={accessibilityInformationDescription} />
);

export const ContentTimingPopover = () => (
  <InfoTrigger id="contentTiming" title="Content Timing" description={accessibilityProps.contentTiming.description} />
);

export const TextFormatPopover = () => (
  <InfoTrigger id="textFormat" title="Text Format" description={accessibilityProps.textFormat.description} />
);

export const ColorAndContrastPopover = () => (
  <InfoTrigger id="colorAndContrast" title="Color and Contrast" description={accessibilityProps.colorAndContrast.description} />
);

export const VisualImpactPopover = () => (
  <InfoTrigger id="visualImpact" title="Visual Impact" description={accessibilityProps.visualImpact.description} />
);

export const AuditoryPopover = () => (
  <InfoTrigger id="auditory" title="Auditory" description={accessibilityProps.auditory.description} />
);

export const TouchPopover = () => (
  <InfoTrigger id="touch" title="Touch" description={accessibilityProps.touch.description} />
);

export const HapticFeedbackPopover = () => (
  <InfoTrigger id="hapticFeedback" title="Haptic Feedback" description={accessibilityProps.hapticFeedback.description} />
);

export const RepetitiveMotionPopover = () => (
  <InfoTrigger id="repetitiveMotion" title="Repetitive Motion" description={accessibilityProps.repetitiveMotion.description} />
);

export const MovementAndGesturePopover = () => (
  <InfoTrigger id="movementAndGesture" title="Movement and Gesture" description={accessibilityProps.movementAndGesture.description} />
);
