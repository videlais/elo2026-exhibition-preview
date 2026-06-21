import { Card } from "react-bootstrap";
import { copyrights } from "../../../images/images";
import aboutJson from "../../../json/about.json";

export default function Footer() {
  const { exhibitionName, editors, publicationYear, publisher } = aboutJson.citation;
  return (
    <footer id="siteFooter" role="contentinfo">
      <Card className="elcCard w-100 m-0 rounded-0" id="elcCopyrightInfo">
        <Card.Body>
          <p className="siteFooter__citation">
            <em>{exhibitionName}</em>. {editors} (eds.), {publisher}, {publicationYear}.
          </p>
          <p className="siteFooter__copyright">
            Collection editorials and other content:&nbsp;
            <a id="elcCopyright" rel="noreferrer" href={copyrights["CC-BY-NC-ND"].url} target="_blank">
              <img src={copyrights["CC-BY-NC-ND"].image} alt="CC BY-NC-ND license" />
            </a>
          </p>
        </Card.Body>
      </Card>
    </footer>
  );
}