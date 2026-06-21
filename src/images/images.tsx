const base = (import.meta.env.BASE_URL ?? '/').replace(/\/+$/, '/');
const img = (filename: string) => `${base}images/copyrights/${filename}`;

export const copyrights: { [index: string]: { image: string; url: string } } = {
  "CC0 (Public Domain)": { image: img('publicdomain.png'), url: "https://creativecommons.org/share-your-work/public-domain/cc0" },
  "CC-BY-NC-ND": { image: img('by-nc-nd.png'), url: "http://creativecommons.org/licenses/by-nc-nd/4.0/" },
  "CC-BY-NC-SA": { image: img('by-nc-sa.png'), url: "https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode" },
  "CC BY-SA 4.0": { image: img('by-sa.png'), url: "http://creativecommons.org/licenses/by-sa/4.0/" },
  "CC-BY-SA": { image: img('by-sa.png'), url: "http://creativecommons.org/licenses/by-sa/4.0/" },
  "CC-BY-NC": { image: img('by-nc.png'), url: "http://creativecommons.org/licenses/by-nc/4.0/" },
  "CC-BY-ND": { image: img('by-nd.png'), url: "http://creativecommons.org/licenses/by-nd/4.0/" },
  "CC-BY": { image: img('by.png'), url: "http://creativecommons.org/licenses/by/4.0/" },
  "Free Art License (v1.3)": { image: img('free-art.png'), url: "http://artlibre.org/licence/lal/en/" },
  "ISC license": { image: img('isc-license.png'), url: "https://opensource.org/licenses/ISC" },
  "All rights reserved": { image: img('all-rights-reserved.png'), url: "" }
};