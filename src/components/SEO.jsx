import { useEffect } from "react";

const SITE_URL = "https://talibconnect.com";
const DEFAULT_DESCRIPTION =
  "Find and share past exam papers from universities across Algeria on TalibConnect.";

function setMeta(name, content, attribute = "name") {
  let element = document.head.querySelector(`meta[${attribute}="${name}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

export default function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  path = "/",
  noindex = false,
  schema,
}) {
  useEffect(() => {
    const canonicalUrl = `${SITE_URL}${path === "/" ? "/" : path}`;
    document.title = title;
    setMeta("description", description);
    setMeta("robots", noindex ? "noindex, nofollow" : "index, follow");
    setMeta("og:title", title, "property");
    setMeta("og:description", description, "property");
    setMeta("og:url", canonicalUrl, "property");
    setMeta("og:type", "website", "property");
    setMeta("twitter:card", "summary");
    setMeta("twitter:title", title);
    setMeta("twitter:description", description);

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;

    const existingSchema = document.head.querySelector(
      'script[data-seo-schema="true"]',
    );
    if (schema) {
      const element = existingSchema || document.createElement("script");
      element.type = "application/ld+json";
      element.dataset.seoSchema = "true";
      element.textContent = JSON.stringify(schema);
      if (!existingSchema) document.head.appendChild(element);
    } else {
      existingSchema?.remove();
    }
  }, [description, noindex, path, schema, title]);

  return null;
}

export { SITE_URL };
