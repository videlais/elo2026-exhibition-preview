import { Link } from "react-router-dom";
import { BoxArrowUpRight } from "react-bootstrap-icons";

interface SearchResultLinkProps {
  /** Which playlist facet the value should filter on. */
  param: "genre" | "keyword" | "language";
  value: string;
}

/**
 * Links a facet value (genre or keyword) to its filtered results in the
 * playlist view, opening in a new tab with an accessible "opens in a new tab"
 * indicator.
 */
export default function SearchResultLink({ param, value }: SearchResultLinkProps) {
  const search = `?${new URLSearchParams({ [param]: value }).toString()}`;
  return (
    <Link
      to={{ pathname: "/playlist", search }}
      target="_blank"
      rel="noopener noreferrer"
    >
      {value}
      <BoxArrowUpRight className="ms-1" size={12} aria-hidden="true" />
      <span className="visually-hidden"> (opens in a new tab)</span>
    </Link>
  );
}
