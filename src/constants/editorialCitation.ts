const EDITORIAL_CITATION_AUTHOR = "Lyle Skains";
const EDITORIAL_CITATION_BOOKTITLE = "ELO 2024 (Un)Linking - Exhibition";
const EDITORIAL_CITATION_YEAR = "2024";
const EDITORIAL_CITATION_PUBLISHER = "Electronic Literature Organization";
const EDITORIAL_CITATION_ADDRESS = "Washington State University, Vancouver, WA, USA";
const EDITORIAL_CITATION_LANGID = "english";

function normalizeEditorialAbstract(statement: string): string {
  return statement
    .replaceAll(/<\/?[^>]+>/g, "")
    .replaceAll("&", "\\&")
    .replaceAll("$", "\\$");
}

export function getEditorialCitationKey(workUrl: string): string {
  return `editorialStatement${workUrl.replace("-", "")}2024`;
}

export function buildEditorialCitation({
  workUrl,
  workTitle,
  editorialStatement,
  publicUrl,
}: {
  workUrl: string;
  workTitle: string;
  editorialStatement: string;
  publicUrl: string;
}): string {
  const statement = normalizeEditorialAbstract(editorialStatement);
  const key = getEditorialCitationKey(workUrl);

  return `@incollection{${key},
  author = {${EDITORIAL_CITATION_AUTHOR}},
  title = {Editorial Statement of '${workTitle}'},
  booktitle = {${EDITORIAL_CITATION_BOOKTITLE}},
  abstract = {${statement}},
  year = {${EDITORIAL_CITATION_YEAR}},
  publisher = {${EDITORIAL_CITATION_PUBLISHER}},
  address = {${EDITORIAL_CITATION_ADDRESS}},
  langid = {${EDITORIAL_CITATION_LANGID}},
  url = {${publicUrl}}
}`;
}
