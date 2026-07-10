import { render } from "@testing-library/react";
import { describe, it } from "vitest";

// Every card Popovers module exports a set of zero-argument info-popover
// components. Many only appear on a work page when their specific field is
// populated, so rendering each one directly covers the rare-field popovers.
import * as AiPopovers from "../src/components/cards/ArtificialIntelligenceInformation/Popovers";
import * as AccessibilityPopovers from "../src/components/cards/AccessibilityInformationCard/Popovers";
import * as CreatorPopovers from "../src/components/cards/CreatorMetadataCard/Popovers";
import * as EntityPopovers from "../src/components/cards/EntityInformationCard/Popovers";
import * as MediaPopovers from "../src/components/cards/MediaFilesInformationCard/Popovers";
import * as VersionPopovers from "../src/components/cards/VersionInformationCard/Popovers";
import * as WorkInfoPopovers from "../src/components/cards/WorkInformationCard/Popovers";
import * as ExternalLinksPopovers from "../src/components/cards/WorksExternalLinksInformationCard/Popovers";

const modules: Record<string, Record<string, unknown>> = {
  ArtificialIntelligenceInformation: AiPopovers,
  AccessibilityInformationCard: AccessibilityPopovers,
  CreatorMetadataCard: CreatorPopovers,
  EntityInformationCard: EntityPopovers,
  MediaFilesInformationCard: MediaPopovers,
  VersionInformationCard: VersionPopovers,
  WorkInformationCard: WorkInfoPopovers,
  WorksExternalLinksInformationCard: ExternalLinksPopovers,
};

describe("card popovers", () => {
  for (const [cardName, mod] of Object.entries(modules)) {
    it(`renders every exported ${cardName} popover`, () => {
      for (const [name, exported] of Object.entries(mod)) {
        // Only render capitalized zero-arg components.
        if (typeof exported === "function" && /^[A-Z]/.test(name)) {
          const Component = exported as React.ComponentType;
          const { unmount } = render(<Component />);
          unmount();
        }
      }
    });
  }
});
