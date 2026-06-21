import { ELMSWorkInformation } from "./elms/workInformation";
import { ELMSVersionInformation } from "./elms/versionInformation";
import { ELMSAccessibilityInformation } from "./elms/accessibilityInformation";
import { ELMSCopyInformation } from "./elms/copyInformation";
import { ELMSEntityInformation } from "./elms/entityInformation";
import { ELMSCollectionInformation } from "./elms/collectionInformation";
import { ELMSWorksExternalLinksInformation } from "./elms/worksExternalLinksInformation";
import { ELMSArtificialIntelligenceInformation } from "./elms/artificialIntelligenceInformation";
import { ELMSMediaFilesInformation } from "./elms/mediaFilesInformation";
import { ELMSCreatorMetadataInformation } from "./elms/creatorMetadataInformation";

interface ELMSWork {
  workInformation: ELMSWorkInformation;
  versionInformation: ELMSVersionInformation;
  accessibilityInformation: ELMSAccessibilityInformation;
  copyInformation?: ELMSCopyInformation;
  entityInformation: ELMSEntityInformation[];
  collectionInformation?: ELMSCollectionInformation;
  worksExternalLinksInformation?: ELMSWorksExternalLinksInformation[];
  artificialIntelligenceInformation: ELMSArtificialIntelligenceInformation;
  mediaFilesInformation: ELMSMediaFilesInformation;
  creatorMetadataInformation?: ELMSCreatorMetadataInformation;
}

export default ELMSWork;
