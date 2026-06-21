import { Container } from "react-bootstrap";
import PageLayout from "../components/PageLayout";
import aboutJson from "../json/about.json";

export default function AboutPage() {
  const { organizers, statement } = aboutJson;

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
            <p key={index}>{paragraph}</p>
          ))}
        </section>
      </Container>
    </PageLayout>
  );
}
