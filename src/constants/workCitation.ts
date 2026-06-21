const WORK_CITATION_EDITORS = [
  { family: "Skains", given: "Lyle" },
  { family: "Cox", given: "Daniel" },
  { family: "Edgar", given: "PD" },
  { family: "Finch", given: "Ricky" },
  { family: "Shier", given: "Mike" },
] as const;

const WORK_CITATION_PUBLISHER = "Electronic Literature Organization";
const WORK_CITATION_ADDRESS = "University of Central Florida, Orlando, Florida, USA";
const WORK_CITATION_LANGID = "en-US";
const WORK_CITATION_ISSUED_YEAR = 2024;

function toCitationAuthors(authorDisplayName: string) {
  return authorDisplayName
    .replaceAll(/ *\(.*\) */gi, "")
    .split(",")
    .map((author) => author.trim())
    .filter((author) => author.length > 0)
    .map((author) => {
      const split = author.split(" ").filter((part) => part.length > 0);
      return {
        family: split[split.length - 1] ?? "",
        given: split.slice(0, split.length - 1).join(" "),
      };
    });
}

export function getWorkCitationCiteKey(authorDisplayName: string): string {
  const authors = toCitationAuthors(authorDisplayName);
  return authors[0]?.family || "work";
}

export function buildWorkCitation({
  slug,
  title,
  authorDisplayName,
  descriptionOfWork,
  year,
  publicUrl,
}: {
  slug: string;
  title: string;
  authorDisplayName: string;
  descriptionOfWork?: string;
  year?: string;
  publicUrl: string;
}) {
  const authors = toCitationAuthors(authorDisplayName);
  const today = new Date();

  return {
    type: "book",
    id: slug,
    author: authors,
    editor: WORK_CITATION_EDITORS,
    title,
    issued: {
      "date-parts": [[WORK_CITATION_ISSUED_YEAR]],
    },
    publisher: WORK_CITATION_PUBLISHER,
    abstract: descriptionOfWork,
    address: WORK_CITATION_ADDRESS,
    langid: WORK_CITATION_LANGID,
    accessed: {
      "date-parts": [[today.getFullYear(), today.getMonth(), today.getDate()]],
    },
    "original-date": { "date-parts": [[year]] },
    URL: publicUrl,
  };
}
