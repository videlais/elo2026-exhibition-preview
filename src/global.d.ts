// src/global.d.ts
// React 19 removed the global JSX namespace; re-declare it for compatibility
// with existing components that use JSX.Element as a return type annotation.
import type { JSX as ReactJSX } from "react";
declare global {
  namespace JSX {
    type Element = ReactJSX.Element;
    type IntrinsicElements = ReactJSX.IntrinsicElements;
    type IntrinsicAttributes = ReactJSX.IntrinsicAttributes;
    type ElementChildrenAttribute = ReactJSX.ElementChildrenAttribute;
    type LibraryManagedAttributes<C, P> = ReactJSX.LibraryManagedAttributes<C, P>;
  }
}
