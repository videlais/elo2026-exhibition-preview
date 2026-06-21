import { Children, ReactNode } from "react";

interface SlotChild {
  props?: {
    name?: string;
    children?: ReactNode;
  };
}

interface UseSlotHookOptions {
  children: ReactNode | Array<ReactNode>
  name: string
  fallback?: ReactNode
}

const useSlot = (options: UseSlotHookOptions): (() => ReactNode) | null => {
  const children: SlotChild[] = Children.toArray(options.children) as SlotChild[];
  const predicate = (child: SlotChild) => {
    return child?.props?.name === options.name;
  };

  if (children.some(predicate)) {
    return () => children.find(predicate)!.props?.children;
  }

  if (options.fallback) {
    return () => options.fallback;
  }

  return null;
};

export default useSlot;