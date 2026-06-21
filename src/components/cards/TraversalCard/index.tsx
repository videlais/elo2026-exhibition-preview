import { Card } from "react-bootstrap";
import { Work } from "../../../types";

export default function TraversalCard({ work }: { work: Work }): JSX.Element {
  return (
    <Card>
      <Card.Header>
        <Card.Title as="h2">Traversal Video</Card.Title>
      </Card.Header>
      <Card.Body className="elcCardBody">
        <video controls className="w-100">
          <source src={`${import.meta.env.BASE_URL}/video/webm/ELO-ID${work.id}-WEBM.webm`} type="video/webm" />
          <source src={`${import.meta.env.BASE_URL}/video/mp4/ELO-ID${work.id}-MP4.mp4`} type="video/mp4" />
        </video>
      </Card.Body>
    </Card>
  );
}