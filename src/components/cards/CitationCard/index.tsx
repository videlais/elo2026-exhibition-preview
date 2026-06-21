import { Card } from "react-bootstrap";
import { CitationWidget } from "../../citation/CitationWidget";
import { buildWorkCitation, getWorkCiteKey } from "../../../constants/workCitation";
import type ELMSWork from "../../../types/ELMSWork";

export default function CitationCard(work: ELMSWork): JSX.Element {
  const publicUrl = typeof window !== "undefined" ? window.location.href : "";
  const citation = buildWorkCitation(work, publicUrl);
  const citeKey = getWorkCiteKey(work);

  return (
    <Card>
      <Card.Header>
        <Card.Title as="h2">Citation Information</Card.Title>
      </Card.Header>
      <Card.Body>
        <CitationWidget citation={citation} citeKey={citeKey} />
      </Card.Body>
    </Card>
  );
}

