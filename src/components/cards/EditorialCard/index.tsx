import { useState } from "react";
import { Button, Card } from "react-bootstrap";
import type { Work } from "../../../types/work";
import { RichTextBlock } from "../../../utils/richText";
import { buildEditorialCitation, getEditorialCitationKey } from "../../../constants/editorialCitation";
import CitationModal from "../../modals/CitationModal";
import "./index.css";

export default function EditorialCard({ editorialStatement, work }: { work: Work, editorialStatement: string }): JSX.Element {
  const [showCitationModal, setShowCitationModal] = useState(false);

  const citation = buildEditorialCitation({
    workUrl: work.url,
    workTitle: work.title,
    editorialStatement,
    publicUrl: typeof window !== 'undefined' ? window.location.href : '',
  });
  const citeKey = getEditorialCitationKey(work.url);

  return (
    <Card className="elcCard editorialCard">
      <Card.Header className="elcCardHeader">
        <Card.Title as="h2">Editorial Statement</Card.Title>
      </Card.Header>
      <Card.Body className="elcCardBody">
        <RichTextBlock className="editorialCardStatement" content={editorialStatement} />
        <Button size="sm" aria-haspopup="dialog" onClick={() => setShowCitationModal(true)}>Cite</Button>
        <CitationModal
          show={showCitationModal}
          onHide={() => setShowCitationModal(false)}
          title="Cite this Editorial Statement"
          citeKey={citeKey}
          citation={citation}
        />
      </Card.Body>
    </Card>
  );
}
