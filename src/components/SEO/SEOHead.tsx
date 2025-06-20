import { useEffect, memo } from "react";

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

// Helper function to update meta tags
const updateMetaTag = (name: string, content: string, property?: boolean) => {
  const selector = property
    ? `meta[property="${name}"]`
    : `meta[name="${name}"]`;
  let element = document.querySelector(selector) as HTMLMetaElement;

  if (!element) {
    element = document.createElement("meta");
    if (property) {
      element.setAttribute("property", name);
    } else {
      element.setAttribute("name", name);
    }
    document.head.appendChild(element);
  }

  element.setAttribute("content", content);
};

// Helper function to update link tags
const updateLinkTag = (rel: string, href: string) => {
  let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;

  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", rel);
    document.head.appendChild(element);
  }

  element.setAttribute("href", href);
};

// Helper function to update structured data
const updateStructuredData = (
  data: ReturnType<typeof generateStructuredData>
) => {
  // Remove existing structured data
  const existingScript = document.querySelector(
    'script[type="application/ld+json"]'
  );
  if (existingScript) {
    existingScript.remove();
  }

  // Add new structured data
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
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
    useEffect(() => {
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

      // Update document title
      document.title = fullTitle;

      // Update basic meta tags
      updateMetaTag("description", description);
      updateMetaTag("keywords", allKeywords);
      if (author) updateMetaTag("author", author);

      // Update robots
      updateMetaTag("robots", noIndex ? "noindex,nofollow" : "index,follow");

      // Update canonical URL
      if (canonical) {
        updateLinkTag("canonical", canonical);
      }

      // Update Open Graph tags
      updateMetaTag("og:type", type, true);
      updateMetaTag("og:title", fullTitle, true);
      updateMetaTag("og:description", description, true);
      updateMetaTag("og:image", fullImage, true);
      updateMetaTag("og:url", fullUrl, true);
      updateMetaTag("og:site_name", "The Blog Spot", true);
      updateMetaTag("og:locale", "en_US", true);

      // Update article specific Open Graph tags
      if (type === "article") {
        if (author) updateMetaTag("article:author", author, true);
        if (publishedTime)
          updateMetaTag("article:published_time", publishedTime, true);
        if (modifiedTime)
          updateMetaTag("article:modified_time", modifiedTime, true);
        if (section) updateMetaTag("article:section", section, true);

        // Remove existing article tags
        const existingTags = document.querySelectorAll(
          'meta[property^="article:tag"]'
        );
        existingTags.forEach((tag) => tag.remove());

        // Add new article tags
        tags.forEach((tag) => {
          updateMetaTag("article:tag", tag, true);
        });
      }

      // Update Twitter Card tags
      updateMetaTag("twitter:card", "summary_large_image");
      updateMetaTag("twitter:site", "@theblogspot");
      updateMetaTag("twitter:creator", "@theblogspot");
      updateMetaTag("twitter:title", fullTitle);
      updateMetaTag("twitter:description", description);
      updateMetaTag("twitter:image", fullImage);

      // Update additional meta tags
      updateMetaTag("theme-color", "#D2691E");
      updateMetaTag("msapplication-TileColor", "#D2691E");
      updateMetaTag("viewport", "width=device-width, initial-scale=1.0");

      // Update structured data
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
      updateStructuredData(structuredData);
    }, [
      title,
      description,
      keywords,
      image,
      url,
      type,
      author,
      publishedTime,
      modifiedTime,
      section,
      tags,
      noIndex,
      canonical,
    ]);

    return null; // This component doesn't render anything
  }
);

SEOHead.displayName = "SEOHead";
