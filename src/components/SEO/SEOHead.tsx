import { Helmet } from "react-helmet-async";
import { memo } from "react";

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: "website" | "article" | "profile";
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
  noIndex?: boolean;
  canonical?: string;
}

interface StructuredDataProps {
  type: "WebSite" | "Article" | "BlogPosting" | "Organization";
  name: string;
  description: string;
  url: string;
  image?: string;
  author?: string;
  datePublished?: string;
  dateModified?: string;
  keywords?: string[];
}

const generateStructuredData = (props: StructuredDataProps) => {
  const baseData = {
    "@context": "https://schema.org",
    "@type": props.type,
    name: props.name,
    description: props.description,
    url: props.url,
  };

  if (props.type === "WebSite") {
    return {
      ...baseData,
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${props.url}/search?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    };
  }

  if (props.type === "Article" || props.type === "BlogPosting") {
    return {
      ...baseData,
      image: props.image,
      author: {
        "@type": "Person",
        name: props.author || "The Blog Spot",
      },
      publisher: {
        "@type": "Organization",
        name: "The Blog Spot",
        logo: {
          "@type": "ImageObject",
          url: `${props.url}/logo.png`,
        },
      },
      datePublished: props.datePublished,
      dateModified: props.dateModified,
      keywords: props.keywords?.join(", "),
    };
  }

  if (props.type === "Organization") {
    return {
      ...baseData,
      logo: props.image,
      sameAs: [
        "https://twitter.com/theblogspot",
        "https://instagram.com/theblogspot",
      ],
    };
  }

  return baseData;
};

export const SEOHead = memo<SEOHeadProps>(
  ({
    title = "The Blog Spot - Every Story Matters, Every Voice Belongs",
    description = "The Blog Spot is a home for real stories, memories, and truths from people of every background. Share your poem, photo essay, confession, or family recipe—your voice is welcome here.",
    keywords = [
      "blog",
      "stories",
      "community",
      "writing",
      "poetry",
      "personal stories",
      "diversity",
      "inclusion",
    ],
    image = "/og-image.jpg",
    url = "https://theblogspot.com",
    type = "website",
    author,
    publishedTime,
    modifiedTime,
    section,
    tags = [],
    noIndex = false,
    canonical,
  }) => {
    const fullTitle = title.includes("The Blog Spot")
      ? title
      : `${title} | The Blog Spot`;
    const fullUrl = url.startsWith("http")
      ? url
      : `https://theblogspot.com${url}`;
    const fullImage = image.startsWith("http")
      ? image
      : `https://theblogspot.com${image}`;
    const allKeywords = [...keywords, ...tags].join(", ");

    const structuredDataProps: StructuredDataProps = {
      type: type === "article" ? "BlogPosting" : "WebSite",
      name: fullTitle,
      description,
      url: fullUrl,
      image: fullImage,
      author,
      datePublished: publishedTime,
      dateModified: modifiedTime,
      keywords: [...keywords, ...tags],
    };

    const structuredData = generateStructuredData(structuredDataProps);

    return (
      <Helmet>
        {/* Basic Meta Tags */}
        <title>{fullTitle}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={allKeywords} />
        {author && <meta name="author" content={author} />}

        {/* Canonical URL */}
        {canonical && <link rel="canonical" href={canonical} />}

        {/* Robots */}
        <meta
          name="robots"
          content={noIndex ? "noindex,nofollow" : "index,follow"}
        />

        {/* Open Graph */}
        <meta property="og:type" content={type} />
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={fullImage} />
        <meta property="og:url" content={fullUrl} />
        <meta property="og:site_name" content="The Blog Spot" />
        <meta property="og:locale" content="en_US" />

        {/* Article specific Open Graph */}
        {type === "article" && (
          <>
            {author && <meta property="article:author" content={author} />}
            {publishedTime && (
              <meta property="article:published_time" content={publishedTime} />
            )}
            {modifiedTime && (
              <meta property="article:modified_time" content={modifiedTime} />
            )}
            {section && <meta property="article:section" content={section} />}
            {tags.map((tag) => (
              <meta key={tag} property="article:tag" content={tag} />
            ))}
          </>
        )}

        {/* Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@theblogspot" />
        <meta name="twitter:creator" content="@theblogspot" />
        <meta name="twitter:title" content={fullTitle} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={fullImage} />

        {/* Additional Meta Tags */}
        <meta name="theme-color" content="#D2691E" />
        <meta name="msapplication-TileColor" content="#D2691E" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
    );
  }
);

SEOHead.displayName = "SEOHead";
