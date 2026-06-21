import React from "react";

const Slot: React.FC<{
  name: string
  children?: React.ReactNode
}> = () => null;

type ComponentWithSlot<P> = React.FC<P> & { Slot: typeof Slot };

const withSlot = <P,>(Component: React.FC<P>): ComponentWithSlot<P> => {
  (Component as ComponentWithSlot<P>).Slot = Slot;
  return Component as ComponentWithSlot<P>;
};

export default withSlot;