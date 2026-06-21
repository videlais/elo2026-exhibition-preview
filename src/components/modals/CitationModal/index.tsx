import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { CitationWidget } from "../../citation/CitationWidget";

interface CitationModalProps {
  show: boolean;
  onHide: () => void;
  title: string;
  citeKey: string;
  citation: string | Record<string, unknown>;
}

export default function CitationModal({ show, onHide, title, citeKey, citation }: CitationModalProps): JSX.Element {
  return (
    <Modal show={show} onHide={onHide} centered aria-labelledby="citation-modal-title">
      <Modal.Header closeButton>
        <Modal.Title id="citation-modal-title">{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <CitationWidget citeKey={citeKey} citation={citation} />
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}
