// src/global.d.ts
// React 19 removed the global JSX namespace; re-declare it for compatibility
// with existing components that use JSX.Element as a return type annotation.
import type { JSX as ReactJSX } from 'react';
declare global {
  namespace JSX {
    type Element = ReactJSX.Element;
    type IntrinsicElements = ReactJSX.IntrinsicElements;
    type IntrinsicAttributes = ReactJSX.IntrinsicAttributes;
    type ElementChildrenAttribute = ReactJSX.ElementChildrenAttribute;
    type LibraryManagedAttributes<C, P> = ReactJSX.LibraryManagedAttributes<C, P>;
  }
}

// Module declarations for packages without type definitions
declare module '@yaireo/tagify/dist/react.tagify' {
  import { FC, RefObject } from 'react';
  import Tagify, { TagData, TagifySettings } from '@yaireo/tagify';

  interface TagsProps {
    tagifyRef?: RefObject<Tagify | undefined>
    settings?: Partial<TagifySettings>
    value?: string | TagData[]
    onChange?: (e: CustomEvent) => void
    showDropdown?: boolean
    autoFocus?: boolean
    whitelist?: { value: string; color: string }[]
    placeholder?: string
  }

  const Tags: FC<TagsProps>;
  export default Tags;
}
