import { ReactNode } from "react";
import Header from "./sections/HeaderSection/Header";
import Footer from "./sections/FooterSection/Footer";

interface PageLayoutProps {
  /** id attribute on the main element. */
  id?: string;
  /** Accessible label for the main element (sets aria-label). */
  ariaLabel?: string;
  children: ReactNode;
}

export default function PageLayout({ id, ariaLabel, children }: PageLayoutProps) {
  return (
    <>
      <Header />
      <main id={id} role="main" aria-label={ariaLabel}>
        {children}
      </main>
      <Footer />
    </>
  );
}
