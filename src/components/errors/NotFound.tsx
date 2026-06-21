import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <>
      <p>Work not found.</p>
      <p>Return to <Link to="/">homepage</Link>.</p>
    </>
  );
}
