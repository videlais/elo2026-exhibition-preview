import { works } from "../data/works";
import type ELMSWork from "../types/ELMSWork";

export default function useWorks(): ELMSWork[] {
  return works;
}
