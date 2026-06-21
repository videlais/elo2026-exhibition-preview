import { useNavigate, useLocation } from "react-router-dom";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Search", path: "/search" },
  { label: "About", path: "/about" },
];

export default function NavigationBar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav aria-label="Main navigation" className="navGroup">
      <span>
        {navLinks.map(({ label, path }) => {
          const isActive = path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);
          return isActive ? (
            <span key={path} className="selected">{label}</span>
          ) : (
            <a
              key={path}
              href={path}
              onClick={(e) => { e.preventDefault(); navigate(path); }}
            >
              <span className="navLink">{label}</span>
            </a>
          );
        })}
      </span>
    </nav>
  );
}
