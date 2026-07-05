import type ELMSWork from "../types/ELMSWork";

/**
 * Human-readable author label for a work: every named entity — individual or
 * group — joined with commas and a trailing "and". Returns "" when the work
 * has no named entities.
 */
export function workAuthorName(work: ELMSWork): string {
  const names = (work.entityInformation ?? [])
    .map((entity) => entity.entityName)
    .filter((name): name is string => Boolean(name && name.trim().length > 0));
  if (names.length <= 1) return names[0] ?? "";
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}
