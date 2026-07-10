import { Card } from "react-bootstrap";
import { ELMSAccessibilityInformation } from "../../../types/elms/accessibilityInformation";
import {
  AccessibilityInformationPopover,
  ContentTimingPopover,
  TextFormatPopover,
  ColorAndContrastPopover,
  VisualImpactPopover,
  AuditoryPopover,
  TouchPopover,
  HapticFeedbackPopover,
  RepetitiveMotionPopover,
  MovementAndGesturePopover,
} from "./Popovers";

/**
 * The AccessibilityInformationCard maps to the ELMSAccessibilityInformation
 *  object in the ELMS schema. Each field is a controlled-vocabulary list of
 *  accessibility characteristics; only populated fields are displayed.
 */

interface AccessibilitySection {
  label: string;
  values?: readonly string[];
  Popover: () => JSX.Element;
}

export default function AccessibilityInformationCard(
  {
    contentTiming,
    textFormat,
    colorAndContrast,
    visualImpact,
    auditory,
    touch,
    hapticFeedback,
    repetitiveMotion,
    movementAndGesture,
  }: ELMSAccessibilityInformation): JSX.Element {

  const sections: AccessibilitySection[] = [
    { label: "Content Timing", values: contentTiming, Popover: ContentTimingPopover },
    { label: "Text Format", values: textFormat, Popover: TextFormatPopover },
    { label: "Color and Contrast", values: colorAndContrast, Popover: ColorAndContrastPopover },
    { label: "Visual Impact", values: visualImpact, Popover: VisualImpactPopover },
    { label: "Auditory", values: auditory, Popover: AuditoryPopover },
    { label: "Touch", values: touch, Popover: TouchPopover },
    { label: "Haptic Feedback", values: hapticFeedback, Popover: HapticFeedbackPopover },
    { label: "Repetitive Motion", values: repetitiveMotion, Popover: RepetitiveMotionPopover },
    { label: "Movement and Gesture", values: movementAndGesture, Popover: MovementAndGesturePopover },
  ];

  const populated = sections.filter((section) => section.values && section.values.length > 0);

  return (
    <Card>
      <Card.Header>
        <Card.Title as="h2">Accessibility Information <AccessibilityInformationPopover /></Card.Title>
      </Card.Header>
      <Card.Body>
        {populated.length === 0 ? (
          <p className="card-text">No accessibility metadata has been provided for this work.</p>
        ) : (
          populated.map(({ label, values, Popover }, index) => (
            <div key={label}>
              {index > 0 && <hr />}
              <h3>{label} <Popover /></h3>
              <ul>
                {values!.map((value) => (
                  <li key={value}>{value}</li>
                ))}
              </ul>
            </div>
          ))
        )}
      </Card.Body>
    </Card>
  );
}
