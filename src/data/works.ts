import worksJson from "../json/works.json";
import type ELMSWork from "../types/ELMSWork";

export const works: ELMSWork[] = worksJson as unknown as ELMSWork[];
