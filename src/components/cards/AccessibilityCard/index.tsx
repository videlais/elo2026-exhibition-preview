import { Card } from "react-bootstrap";
import type { Work } from "../../../types/ELMSWork";
import type { AccessibilityInformation } from "../../../types/elms";
import "./index.css";

/** Human-readable labels for each ELMS `accessibilityInformation` field. */
const FIELD_LABELS: Readonly<Record<keyof AccessibilityInformation, string>> = {
  contentTiming: "Content Timing",
  textFormat: "Text Format",
  colorAndContrast: "Color & Contrast",
  visualImpact: "Visual Impact",
  auditory: "Auditory",
  touch: "Touch / Input",
  hapticFeedback: "Haptic Feedback",
  repetitiveMotion: "Repetitive Motion",
  movementAndGesture: "Movement & Gesture",
};

const FIELD_ORDER = Object.keys(FIELD_LABELS) as (keyof AccessibilityInformation)[];

export default function AccessibilityCard({ work }: { work: Work }) {
  const info = work.accessibilityInformation;
  if (!info) return null;

  return (
    <Card className="elcCard accessibilityCard">
      <Card.Header className="elcCardHeader">
        <Card.Title as="h2">Accessibility</Card.Title>
      </Card.Header>
      <Card.Body className="elcCardBody accessibilityCard__body">
        <dl className="accessibilityCard__grid mb-0">
          {FIELD_ORDER.map((key) => (
            <div key={String(key)} className="accessibilityCard__entry">
              <dt className="accessibilityCard__label">{FIELD_LABELS[key]}</dt>
              <dd className="accessibilityCard__value mb-0">
                {info[key] !== undefined && !(Array.isArray(info[key]) && (info[key] as unknown[]).length === 0) ? String((info[key] as unknown[]).join(", ")) : <span className="accessibilityCard__empty">Not Reviewed</span>}
              </dd>
            </div>
          ))}
        </dl>
      </Card.Body>
    </Card>
  );
}
