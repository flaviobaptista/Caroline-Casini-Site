// Sync search and social metadata from the Markdown CMS into index.html before publishing.
// Uses only Node.js built-ins; no packages are required.
const fs = require("node:fs");
const path = require("node:path");

const root = __dirname;

function readCms(name) {
  const markdown = fs.readFileSync(path.join(root, "content", `${name}.md`), "utf8");
  const match = markdown.match(/```json\s*([\s\S]*?)```/i);
  if (!match) throw new Error(`Bloco JSON não encontrado em content/${name}.md`);
  return JSON.parse(match[1]);
}

function escapeAttribute(value) {
  return String(value ?? "").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function upsertMeta(html, attr, key, content) {
  const selector = new RegExp(`<meta\\b(?=[^>]*\\b${attr}="${key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}")[^>]*>`, "i");
  const replacementValue = escapeAttribute(content);
  if (selector.test(html)) return html.replace(selector, (tag) => tag.replace(/\bcontent="[^"]*"/i, `content="${replacementValue}"`));
  return html.replace("</head>", `    <meta ${attr}="${escapeAttribute(key)}" content="${replacementValue}" />\n  </head>`);
}

function upsertCanonical(html, url) {
  const link = /<link\b(?=[^>]*\brel="canonical")[^>]*>/i;
  const value = escapeAttribute(url);
  if (link.test(html)) return html.replace(link, (tag) => tag.replace(/\bhref="[^"]*"/i, `href="${value}"`));
  return html.replace("</head>", `    <link rel="canonical" href="${value}" />\n  </head>`);
}

const seo = readCms("seo");
const settings = readCms("settings");
const seoImage = new URL(seo.image || "", seo.url).href;
const indexPath = path.join(root, "index.html");
let html = fs.readFileSync(indexPath, "utf8");
html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeAttribute(seo.title)}</title>`);
html = upsertMeta(html, "name", "description", seo.description);
html = upsertMeta(html, "name", "keywords", (seo.keywords || []).join(", "));
html = upsertMeta(html, "name", "robots", seo.robots || "index,follow");
html = upsertMeta(html, "property", "og:title", seo.title);
html = upsertMeta(html, "property", "og:description", seo.description);
html = upsertMeta(html, "property", "og:image", seoImage);
html = upsertMeta(html, "property", "og:image:alt", seo.imageAlt || `Logo ${settings.brandName}`);
html = upsertMeta(html, "property", "og:image:type", "image/png");
html = upsertMeta(html, "property", "og:image:width", "1536");
html = upsertMeta(html, "property", "og:image:height", "1024");
html = upsertMeta(html, "property", "og:url", seo.url);
html = upsertMeta(html, "property", "og:site_name", settings.brandName);
html = upsertMeta(html, "name", "twitter:title", seo.title);
html = upsertMeta(html, "name", "twitter:description", seo.description);
html = upsertMeta(html, "name", "twitter:image", seoImage);
html = upsertMeta(html, "name", "twitter:image:alt", seo.imageAlt || `Logo ${settings.brandName}`);
html = upsertCanonical(html, seo.url);

const businessSchema = {
  "@context": "https://schema.org",
  "@type": "HealthAndBeautyBusiness",
  name: settings.brandName,
  description: seo.description,
  image: seoImage,
  telephone: settings.contacts.phone,
  email: settings.contacts.email,
  url: seo.url,
  address: {
    "@type": "PostalAddress",
    streetAddress: settings.address.street,
    addressLocality: settings.address.city,
    addressRegion: settings.address.region,
    addressCountry: "BR"
  },
  sameAs: settings.socials.map((social) => social.url).filter((url) => url && url !== "#")
};
const schemaTag = `<script id="business-schema" type="application/ld+json">${JSON.stringify(businessSchema).replace(/</g, "\\u003c")}</script>`;
const schemaRegex = /<script\b(?=[^>]*\bid="business-schema")[\s\S]*?<\/script>/i;
html = schemaRegex.test(html) ? html.replace(schemaRegex, schemaTag) : html.replace("</head>", `    ${schemaTag}\n  </head>`);
fs.writeFileSync(indexPath, html, "utf8");
console.log("SEO e cartões de compartilhamento atualizados em index.html.");
