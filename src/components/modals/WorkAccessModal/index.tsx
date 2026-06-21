import { Button, Modal } from "react-bootstrap";

export default function WorkAccessModal({
  title,
  workId,
  workUrl,
  show,
  onClose,
  instructionsBlock,
  beginLinks,
}: {
  title: string;
  workId: string | number;
  workUrl: string;
  show: boolean;
  onClose: () => void;
  instructionsBlock: React.ReactNode;
  beginLinks: React.ReactNode;
}) {
  return (
    <Modal size="lg" show={show} onHide={onClose} centered aria-labelledby="work-modal-title">
      <Modal.Header closeButton>
        <Modal.Title id="work-modal-title">{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="text-center">
          <video controls width="100%">
            <source src={`${import.meta.env.BASE_URL}/video/webm/ELO-ID${workId}-WEBM.webm`} type="video/webm" />
            <source src={`${import.meta.env.BASE_URL}/video/mp4/ELO-ID${workId}-MP4.mp4`} type="video/mp4" />
          </video>
        </div>
        {instructionsBlock}
        <a className="beginLink" key={0} rel="noreferrer" href={workUrl} target="_blank">
          Online
        </a>
        {beginLinks}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}
