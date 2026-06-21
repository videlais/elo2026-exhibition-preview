import WebApp from './pages/Routing'; 
import { Helmet, HelmetProvider } from "react-helmet-async";
import aboutJson from "./json/about.json";

const { exhibitionName, publicationYear, editors, publisher, ogType, twitterCard } = aboutJson.citation;
const { description } = aboutJson;

const siteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: exhibitionName,
  description,
  publisher: { "@type": "Organization", name: publisher },
  url: typeof window !== "undefined" ? window.location.origin + (import.meta.env.BASE_URL ?? "/") : (import.meta.env.BASE_URL ?? "/"),
  inLanguage: "English",
};

// This is needed because Vita can be deployed to a subdirectory, and we want to ensure that the favicon and other assets are correctly referenced regardless of the base URL.
const buildAssetUrl = (path: string) => {
  const normalizedBase = (import.meta.env.BASE_URL ?? '/').replace(/\/+$/, '/');
  const normalizedPath = path.replace(/^\/+/, '');
  return `${normalizedBase}${normalizedPath}`;
};

export default function App() {
  return ( <HelmetProvider>
    <Helmet>
      <title>{exhibitionName}</title>
      <meta name="citation_publication_date" content={publicationYear} />
      <meta name="citation_online_date" content={publicationYear} />
      <meta name="citation_available_date" content={publicationYear} />
      <meta name="citation_editors" content={editors} />
      <meta name="citation_publisher" content={publisher} />
      <meta name="citation_public_url" content={typeof window !== 'undefined' ? window.location.href : ''} />
      <meta name="citation_language" content="English" />
      <meta name="citation_title" content={exhibitionName} />
      <meta name="DC.Title" content={exhibitionName} />
      <meta name="DC.Date.Created" content={publicationYear} />
      <meta name="DC.Relation.IsPartOf" content={`urn:issn:1932-${publicationYear}`} />
      <meta name="DC.Publisher" content={publisher} />
      <link rel="apple-touch-icon-precomposed" sizes="57x57" href={buildAssetUrl('images/favicons/apple-touch-icon-57x57.png')} />
      <link rel="apple-touch-icon-precomposed" sizes="60x60" href={buildAssetUrl('images/favicons/apple-touch-icon-60x60.png')} />
      <link rel="apple-touch-icon-precomposed" sizes="72x72" href={buildAssetUrl('images/favicons/apple-touch-icon-72x72.png')} />
      <link rel="apple-touch-icon-precomposed" sizes="76x76" href={buildAssetUrl('images/favicons/apple-touch-icon-76x76.png')} />
      <link rel="apple-touch-icon-precomposed" sizes="114x114" href={buildAssetUrl('images/favicons/apple-touch-icon-114x114.png')} />
      <link rel="apple-touch-icon-precomposed" sizes="120x120" href={buildAssetUrl('images/favicons/apple-touch-icon-120x120.png')} />
      <link rel="apple-touch-icon-precomposed" sizes="144x144" href={buildAssetUrl('images/favicons/apple-touch-icon-144x144.png')} />
      <link rel="apple-touch-icon-precomposed" sizes="152x152" href={buildAssetUrl('images/favicons/apple-touch-icon-152x152.png')} />
      <meta name="application-name" content={exhibitionName} />
      <meta name="msapplication-TileColor" content="#FFFFFF" />
      <meta name="msapplication-square70x70logo" content={buildAssetUrl('images/mstile-70x70.png')} />
      <meta name="msapplication-TileImage" content={buildAssetUrl('images/mstile-144x144.png')} />
      <meta name="msapplication-square150x150logo" content={buildAssetUrl('images/mstile-150x150.png')} />
      <meta name="msapplication-wide310x150logo" content={buildAssetUrl('images/mstile-310x150.png')} />
      <meta name="msapplication-square310x310logo" content={buildAssetUrl('images/mstile-310x310.png')} />
      <meta http-equiv="Content-Type" content="application/xhtml+xml; charset=utf-8" />
      <meta name="description" content={description} />
      <meta name="keywords"
        content="e-lit, electronic literature, new media, electronic literature organization, digital media" />
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes" />
      <meta property="og:url" content={`${import.meta.env.BASE_URL}`} />
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={exhibitionName} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={buildAssetUrl('images/twitterPromo.png')} />
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:site" content="@eliterature" />
      <meta name="twitter:title" content={exhibitionName} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={buildAssetUrl('images/twitterPromo.png')} />
      <script type="application/ld+json">
        {JSON.stringify(siteJsonLd)}
      </script>
    </Helmet>
    <WebApp />
  </HelmetProvider>);
}
