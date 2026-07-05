import { Container } from "react-bootstrap";
import PageLayout from "../components/PageLayout";
import { RichTextBlock } from "../utils/richText";
import aboutJson from "../json/about.json";

export default function AboutPage() {
  const { organizers, statement, credit } = aboutJson;

  return (
    <PageLayout id="aboutMain">
      <Container id="aboutContainer">
        <section aria-label={organizers.title} className="elcContainer">
          <h2 className="aboutSubHeader">{organizers.title}</h2>
          <div className="aboutOrganizersGrid">
            <div className="aboutOrganizersColumn aboutOrganizersColumn--left">
              <p><strong>Conference Chair</strong>:<br /> {organizers.chair}</p>
              <p><strong>Co-Chairs</strong>:<br /> {organizers.coChairs.join(" & ")}</p>
            </div>
            <div className="aboutOrganizersColumn aboutOrganizersColumn--right">
              <p><strong>Exhibition Team</strong>:</p>
              <ul>
                {organizers.team.map((member) => (
                  <li key={member}>{member}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section aria-label={statement.title} className="elcContainer">
          <h2 className="aboutSubHeader">{statement.title}</h2>
          {statement.paragraphs.map((paragraph, index) => (
            <RichTextBlock key={index} content={paragraph} />
          ))}
        </section>
        <section aria-label="History" className="elcContainer mt-2">
          <h2 className="aboutSubHeader">History</h2>
          <RichTextBlock content={credit.history} />
        </section>

        <section aria-label="Metadata" className="elcContainer mt-2">
          <h2 className="aboutSubHeader">Metadata</h2>
          <RichTextBlock content={credit.metadata} />
        </section>
      </Container>
    </PageLayout>
  );
}
