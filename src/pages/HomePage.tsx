import { Container } from "react-bootstrap";
import PageLayout from "../components/PageLayout";
import WorkGrid from "../components/WorkGrid";
import useWorks from "../hooks/useWorks";

export default function HomePage() {
  const works = useWorks();
  return (
    <PageLayout id="galleryMain">
      <Container id="galleryGrid" as="section">
        <WorkGrid works={works} ariaLabel="Works in the exhibition" />
      </Container>
    </PageLayout>
  );
}
