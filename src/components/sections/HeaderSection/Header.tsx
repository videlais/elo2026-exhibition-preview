import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Nav, Navbar } from "react-bootstrap";
import aboutJson from "../../../json/about.json";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const navLinks: { label: string; path: string }[] = [
    { label: "Home", path: "/" },
    { label: "Search", path: "/search" },
    { label: "Playlist", path: "/playlist" },
    { label: "About", path: "/about" },
  ];

  return (
    <header id="siteHeader" role="banner" className="siteHeader">
      {/* Centered branding — in normal flow so it contributes to header height */}
      <div className="siteHeader__brandRow text-center py-3">
        <Container>
          <h1 className="siteHeader__title mb-1">{aboutJson.citation.exhibitionName}</h1>
          <p className="siteHeader__description mb-0">{aboutJson.description}</p>
          <p className="siteHeader__organizers mb-0">
            Co-Chairs: {aboutJson.organizers.chair}
            {aboutJson.organizers.coChairs.length > 0 && (
              <> &mdash; {aboutJson.organizers.coChairs.join(" & ")}</>
            )}
          </p>
        </Container>
      </div>

      {/* Nav row — hamburger on the right, links collapse on small screens */}
      <Navbar
        expand="lg"
        expanded={expanded}
        onToggle={setExpanded}
        className="siteHeader__navBar py-0"
        as="nav"
        aria-label="Main navigation"
      >
        <Container>
          <Navbar.Toggle aria-controls="siteHeaderNav" className="ms-auto" />
          <Navbar.Collapse id="siteHeaderNav">
            <Nav className="ms-auto">
              {navLinks.map(({ label, path }) => {
                const isActive =
                  path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);
                return (
                  <Nav.Link
                    key={path}
                    href={path}
                    active={isActive}
                    aria-current={isActive ? "page" : undefined}
                    className="siteHeader__navLink"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(path);
                      setExpanded(false);
                    }}
                  >
                    {label}
                  </Nav.Link>
                );
              })}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}
