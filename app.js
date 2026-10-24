const FILES = ["settings", "navigation", "home", "about", "clinic", "services", "models", "products", "contact", "seo", "theme"];
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

async function readMarkdown(name) {
  const response = await fetch(`content/${name}.md`, { cache: "no-store" });
  if (!response.ok) throw new Error(`Não foi possível carregar content/${name}.md`);
  const markdown = await response.text();
  const match = markdown.match(/```json\s*([\s\S]*?)```/i);
  if (!match) throw new Error(`O arquivo content/${name}.md precisa conter um bloco json.`);
  return JSON.parse(match[1]);
}

const escapeHTML = (value = "") => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
const safeUrl = (value = "#") => /^(https?:|mailto:|tel:|#|\/|\.\/)/i.test(String(value)) ? String(value) : "#";
const waUrl = (settings, message = "Olá! Gostaria de saber mais sobre os atendimentos.") => {
  const phone = String(settings.contacts?.whatsapp || "").replace(/\D/g, "");
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
};
const money = (value) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(value) || 0);
const richText = (paragraphs = []) => paragraphs.map((paragraph) => `<p>${escapeHTML(paragraph)}</p>`).join("");
const cta = (label, href, extra = "") => `<a class="button ${extra}" href="${escapeHTML(safeUrl(href))}" ${href.startsWith("https:") ? 'target="_blank" rel="noopener noreferrer"' : ""}>${escapeHTML(label)} <span aria-hidden="true">↗</span></a>`;

const socialIcons = {
  instagram: '<svg class="stroke" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".7" fill="currentColor" stroke="none"/></svg>',
  facebook: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.5 21v-8h2.8l.4-3.1h-3.2v-2c0-.9.3-1.6 1.6-1.6H17V3.5c-.4-.1-1.5-.2-2.8-.2-2.8 0-4.7 1.7-4.7 4.8v1.8H6.7V13h2.8v8h4Z"/></svg>',
  x: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.9 3H22l-6.8 7.8L23.2 21h-6.3L12 14.8 6.5 21H3.3l7.3-8.4L2.8 3h6.4l4.5 5.9L18.9 3Zm-1.1 16h1.7L8.3 4.9H6.5L17.8 19Z"/></svg>',
  tiktok: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19.6 7.4a6.7 6.7 0 0 1-4.1-1.4v8.2a5.7 5.7 0 1 1-5-5.7v3a2.7 2.7 0 1 0 2 2.6V2.8h3a3.8 3.8 0 0 0 4.1 3.7v.9Z"/></svg>',
  threads: '<svg class="stroke" viewBox="0 0 24 24" aria-hidden="true"><path d="M18.6 11.2c-.4-4.4-2.7-6.8-6.7-6.8-4.4 0-7.1 2.9-7.1 7.6 0 4.8 2.7 7.6 7.2 7.6 3.7 0 6.2-1.8 6.2-4.8 0-2.4-1.7-3.8-4.3-3.8-2.3 0-3.7 1.1-3.7 2.8 0 1.2.9 2 2.2 2 1.7 0 2.7-1.1 2.7-3.1 0-2.4-1.2-4-3.2-4"/></svg>',
  youtube: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M23 7a3 3 0 0 0-2.1-2.1C19.1 4.4 12 4.4 12 4.4s-7.1 0-8.9.5A3 3 0 0 0 1 7a31 31 0 0 0-.5 5 31 31 0 0 0 .5 5 3 3 0 0 0 2.1 2.1c1.8.5 8.9.5 8.9.5s7.1 0 8.9-.5A3 3 0 0 0 23 17a31 31 0 0 0 .5-5 31 31 0 0 0-.5-5ZM9.7 15.5v-7l6 3.5-6 3.5Z"/></svg>',
  pinterest: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-3.6 19.3c0-.8 0-1.8.2-2.6l1.3-5.5s-.3-.6-.3-1.5c0-1.4.8-2.4 1.8-2.4.9 0 1.3.7 1.3 1.5 0 .9-.6 2.2-.9 3.5-.3 1.1.5 2 1.6 2 2 0 3.5-2.1 3.5-5.1 0-2.7-1.9-4.6-4.7-4.6-3.2 0-5.1 2.4-5.1 4.9 0 1 .4 2.2 1 2.8.1.2.2.4.1.6l-.4 1.1c-.1.4-.3.5-.6.3-1.4-.7-2.2-2.8-2.2-4.5 0-3.7 2.7-7.1 7.8-7.1 4.1 0 7.3 2.9 7.3 6.8 0 4.1-2.6 7.5-6.2 7.5-1.2 0-2.4-.7-2.8-1.5l-.8 3.1c-.3 1-.9 1.9-1.3 2.6A10 10 0 1 0 12 2Z"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 8.5A1.8 1.8 0 1 0 6.5 5a1.8 1.8 0 0 0 0 3.5ZM5 10h3v9H5v-9Zm5 0h2.9v1.2h.1a3.2 3.2 0 0 1 2.9-1.6c3.1 0 3.7 2 3.7 4.6V19h-3v-4.2c0-1 0-2.4-1.5-2.4s-1.8 1.1-1.8 2.3V19h-3v-9Z"/></svg>'
};

function renderSocials(settings) {
  return (settings.socials || []).filter((item) => item.enabled !== false).map((item) => `<a class="social-link" href="${escapeHTML(safeUrl(item.url))}" aria-label="${escapeHTML(item.name)}" title="${escapeHTML(item.name)}" ${item.url?.startsWith("https:") ? 'target="_blank" rel="noopener noreferrer"' : ""}>${socialIcons[item.icon] || ""}</a>`).join("");
}

function renderNavigation(navigation) {
  const active = navigation.pages.filter((page) => page.enabled !== false && page.menu !== false);
  $("#main-nav").innerHTML = active.map((page) => `<a class="nav-link" href="#${escapeHTML(page.id)}">${escapeHTML(page.label)}</a>`).join("");
  return active;
}

function sectionShell(page, content, classes = "") {
  return `<section class="section ${classes}" id="${escapeHTML(page.id)}" data-page-type="${escapeHTML(page.type)}"><div class="section-inner">${content}</div></section>`;
}

function renderHome(page, data, settings) {
  const h = data.home;
  const hero = `<section class="section hero" id="${escapeHTML(page.id)}" data-page-type="home"><div class="section-inner hero-grid">
    <div class="hero-copy"><p class="eyebrow">${escapeHTML(h.eyebrow)}</p><h1>${escapeHTML(h.title)} <span class="gold-text">${escapeHTML(h.titleAccent)}</span></h1><p class="lead">${escapeHTML(h.description)}</p>
      <div class="hero-buttons">${cta(h.primaryLabel, waUrl(settings, h.whatsappMessage))}${cta(h.secondaryLabel, `#${h.secondaryTarget}`, "button-quiet")}</div>
      <p class="hero-note">${escapeHTML(h.note)}</p>
      <div class="hero-stats">${(h.stats || []).map((stat) => `<div class="stat"><strong>${escapeHTML(stat.value)}</strong><span>${escapeHTML(stat.label)}</span></div>`).join("")}</div>
    </div>
    <div class="hero-visual"><div class="hero-orbit"></div><div class="hero-decoration"></div><div class="hero-photo-wrap"><img class="hero-photo" src="${escapeHTML(h.image)}" alt="${escapeHTML(h.imageAlt)}" fetchpriority="high" /></div><div class="hero-caption"><span>${escapeHTML(h.captionLabel)}</span><strong>${escapeHTML(h.caption)}</strong></div></div>
  </div></section>`;
  const promo = data.home.promo.enabled ? `<section class="section"><div class="section-inner"><div class="promo-band reveal"><div class="promo-content"><div><p class="eyebrow">${escapeHTML(h.promo.eyebrow)}</p><h2>${escapeHTML(h.promo.title)}</h2><p>${escapeHTML(h.promo.description)}</p></div>${cta(h.promo.buttonLabel, waUrl(settings, h.promo.whatsappMessage), "button-quiet")}</div></div></div></section>` : "";
  return hero + promo;
}

function renderAbout(page, data, settings) {
  const a = data.about;
  const copy = `<div class="split-copy reveal"><p class="eyebrow">${escapeHTML(a.eyebrow)}</p><h2>${escapeHTML(a.title)} <span class="gold-text">${escapeHTML(a.titleAccent)}</span></h2><p class="lead">${escapeHTML(a.subtitle)}</p><div class="body-copy">${richText(a.paragraphs)}</div>
    <ul class="credential-list">${a.credentials.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}</ul><p class="body-copy">${escapeHTML(a.closing)}</p>${cta(a.buttonLabel, waUrl(settings, a.whatsappMessage))}</div>`;
  const image = `<div class="editorial-image reveal reveal-delay-1"><img src="${escapeHTML(a.image)}" alt="${escapeHTML(a.imageAlt)}" loading="lazy"/><div class="image-label">${escapeHTML(a.imageCaption)}</div></div>`;
  return sectionShell(page, `<div class="split-layout">${image}${copy}</div>`);
}

function renderClinic(page, data, settings) {
  const c = data.clinic;
  const copy = `<div class="split-copy reveal"><p class="eyebrow">${escapeHTML(c.eyebrow)}</p><h2>${escapeHTML(c.title)} <span class="gold-text">${escapeHTML(c.titleAccent)}</span></h2><div class="body-copy">${richText(c.paragraphs)}</div><div class="clinic-features">${c.features.map((feature) => `<article class="feature-card"><span>${escapeHTML(feature.number)}</span><strong>${escapeHTML(feature.title)}</strong><p>${escapeHTML(feature.description)}</p></article>`).join("")}</div><div style="margin-top:26px">${cta(c.buttonLabel, waUrl(settings, c.whatsappMessage))}</div></div>`;
  const image = `<div class="editorial-image reveal reveal-delay-1"><img src="${escapeHTML(c.image)}" alt="${escapeHTML(c.imageAlt)}" loading="lazy"/><div class="image-label">${escapeHTML(c.imageCaption)}</div></div>`;
  return sectionShell(page, `<div class="split-layout reverse">${copy}${image}</div>`, "soft-section");
}

function renderServices(page, data, settings) {
  const s = data.services;
  const cards = s.items.filter((item) => item.enabled !== false).map((item, index) => `<article class="service-card reveal reveal-delay-${index % 4}"><div class="service-image"><img src="${escapeHTML(item.image)}" alt="${escapeHTML(item.imageAlt || item.title)}" loading="lazy"/><span class="service-number">${String(index + 1).padStart(2, "0")}</span></div><div class="service-body"><h3>${escapeHTML(item.title)}</h3><p>${escapeHTML(item.description)}</p><a class="text-link" href="${escapeHTML(waUrl(settings, `${s.whatsappMessage} ${item.title}.`))}" target="_blank" rel="noopener noreferrer">${escapeHTML(s.buttonLabel)}</a></div></article>`).join("");
  return sectionShell(page, `<div class="section-heading center services-heading"><p class="eyebrow">${escapeHTML(s.eyebrow)}</p><h2 class="services-title">${escapeHTML(s.title)} <span class="gold-text">${escapeHTML(s.titleAccent)}</span></h2><p class="lead">${escapeHTML(s.description)}</p></div><div class="service-grid">${cards || `<div class="empty-state">${escapeHTML(s.emptyMessage)}</div>`}</div>`);
}

function renderModels(page, data, settings) {
  const m = data.models;
  const prices = m.prices.map((price) => `<div class="price-card"><span>${escapeHTML(price.label)}</span><strong>${money(price.value)}</strong><small>${escapeHTML(price.note)}</small></div>`).join("");
  return sectionShell(page, `<div class="model-layout"><div class="model-photo reveal"><img src="${escapeHTML(m.image)}" alt="${escapeHTML(m.imageAlt)}" loading="lazy"/><div class="model-disclaimer">${escapeHTML(m.photoDisclaimer)}</div></div><div class="reveal reveal-delay-1"><p class="eyebrow">${escapeHTML(m.eyebrow)}</p><h2>${escapeHTML(m.title)} <span class="gold-text">${escapeHTML(m.titleAccent)}</span></h2><p class="lead">${escapeHTML(m.description)}</p><div class="price-grid">${prices}</div><p class="body-copy">${escapeHTML(m.terms)}</p>${cta(m.buttonLabel, waUrl(settings, m.whatsappMessage))}</div></div>`, "soft-section");
}

function renderProducts(page, data, settings) {
  const p = data.products;
  const cards = p.items.filter((item) => item.enabled !== false).map((item, index) => `<article class="product-card reveal reveal-delay-${index % 3}"><div class="product-image"><img src="${escapeHTML(item.image)}" alt="${escapeHTML(item.imageAlt || item.name)}" loading="lazy"/></div><div class="product-body"><span class="product-tag">${escapeHTML(item.category)}</span><h3>${escapeHTML(item.name)}</h3><p>${escapeHTML(item.description)}</p><div class="product-bottom"><strong class="product-price">${money(item.price)}</strong><a class="button" href="${escapeHTML(waUrl(settings, `${p.whatsappMessage} ${item.name}.`))}" target="_blank" rel="noopener noreferrer">${escapeHTML(p.buttonLabel)}</a></div></div></article>`).join("");
  const demoNote = p.showDemoNote ? `<p class="lead" style="margin:0 auto 30px;text-align:center">${escapeHTML(p.demoNote)}</p>` : "";
  return sectionShell(page, `<div class="section-heading center"><p class="eyebrow">${escapeHTML(p.eyebrow)}</p><h2>${escapeHTML(p.title)} <span class="gold-text">${escapeHTML(p.titleAccent)}</span></h2><p class="lead">${escapeHTML(p.description)}</p></div>${demoNote}<div class="product-grid">${cards || `<div class="empty-state">${escapeHTML(p.emptyMessage)}</div>`}</div>`);
}

function renderContact(page, data, settings) {
  const c = data.contact;
  const contacts = [
    { icon: "✉", label: c.emailLabel, value: settings.contacts.email, href: `mailto:${settings.contacts.email}` },
    { icon: "◉", label: c.phoneLabel, value: settings.contacts.phoneDisplay, href: `tel:${settings.contacts.phone}` },
    { icon: "◌", label: c.whatsappLabel, value: settings.contacts.whatsappDisplay, href: waUrl(settings, c.whatsappMessage) }
  ].map((item) => `<div class="contact-item"><span class="contact-icon" aria-hidden="true">${item.icon}</span><div><small>${escapeHTML(item.label)}</small><a href="${escapeHTML(item.href)}">${escapeHTML(item.value)}</a></div></div>`).join("");
  const map = `https://maps.google.com/maps?q=${encodeURIComponent(settings.address.mapQuery)}&t=&z=${encodeURIComponent(settings.address.zoom || 14)}&ie=UTF8&iwloc=&output=embed`;
  return sectionShell(page, `<div class="section-heading"><p class="eyebrow">${escapeHTML(c.eyebrow)}</p><h2>${escapeHTML(c.title)} <span class="gold-text">${escapeHTML(c.titleAccent)}</span></h2><p class="lead">${escapeHTML(c.description)}</p></div><div class="contact-panel"><div class="contact-copy"><h3>${escapeHTML(c.panelTitle)}</h3><p class="body-copy">${escapeHTML(c.panelText)}</p><div class="contact-list">${contacts}</div>${cta(c.buttonLabel, waUrl(settings, c.whatsappMessage))}<div style="margin-top:26px"><div class="social-list">${renderSocials(settings)}</div></div></div><div class="contact-map"><iframe title="${escapeHTML(c.mapTitle)}" src="${escapeHTML(map)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe></div></div>`);
}

function renderCustom(page, _data, settings) {
  const heading = `<p class="eyebrow">${escapeHTML(page.eyebrow || settings.genericEyebrow)}</p><h2>${escapeHTML(page.title || page.label)} ${page.titleAccent ? `<span class="gold-text">${escapeHTML(page.titleAccent)}</span>` : ""}</h2>`;
  const description = page.description ? `<p class="lead">${escapeHTML(page.description)}</p>` : "";
  const paragraphs = `<div class="body-copy">${richText(page.paragraphs || [])}</div>`;
  const button = page.buttonLabel ? cta(page.buttonLabel, page.buttonUrl || waUrl(settings, page.whatsappMessage || "Olá! Gostaria de mais informações.")) : "";
  if (page.image) {
    const image = `<div class="editorial-image reveal reveal-delay-1"><img src="${escapeHTML(page.image)}" alt="${escapeHTML(page.imageAlt || page.title || page.label)}" loading="lazy"/></div>`;
    return sectionShell(page, `<div class="split-layout">${image}<div class="split-copy reveal">${heading}${description}${paragraphs}${button}</div></div>`, page.softBackground ? "soft-section" : "");
  }
  return sectionShell(page, `<div class="section-heading">${heading}${description}</div>${paragraphs}${button}`, page.softBackground ? "soft-section" : "");
}

function applyTheme(theme, mode) {
  const colors = theme[mode] || theme.light;
  const style = document.documentElement.style;
  const fontSizeNames = {
    textoPrincipal: "body", textoPrincipalTelaGrande: "body-large", textoPrincipalTelaMuitoGrande: "body-cinema", textoPrincipalCelular: "body-mobile",
    tituloInicio: "heading-hero", tituloInicioTelaGrande: "heading-hero-large", tituloInicioTablet: "heading-hero-tablet", tituloInicioCelular: "heading-hero-mobile",
    tituloSecao: "heading-section", tituloSecaoTelaGrande: "heading-section-large", tituloCartao: "heading-card", tituloCartaoTelaGrande: "heading-card-large", tituloCartaoCelular: "heading-card-mobile",
    tituloProduto: "product-title", textoIntroducao: "lead", textoIntroducaoCelular: "lead-mobile",
    menuSuperior: "navigation", menuSuperiorTelaGrande: "navigation-large", menuSuperiorTelaMuitoGrande: "navigation-cinema", menuSuperiorCelular: "navigation-mobile",
    botao: "button", rotuloPequeno: "eyebrow", textoPequeno: "small", textoMini: "micro", textoAuxiliar: "compact", textoComum: "copy", endereco: "address",
    nomeMarca: "brand", nomeMarcaCelular: "brand-mobile", simboloMarca: "brand-mark", subtituloMarca: "subtitle", subtituloMarcaCelular: "subtitle-mobile",
    legendaDestaque: "hero-caption", legendaImagem: "caption", numeroDestaque: "stat", numeroDestaqueCelular: "stat-mobile",
    tituloPromocao: "promo", precoProcedimento: "price", precoProcedimentoCelular: "price-mobile", precoProduto: "product-price", tituloRodape: "footer-title", menuRodape: "menu-rodape"
  };
  const fontSizeConfig = theme.tamanhosFonte || theme.fontSizes || {};
  const typographyTokens = Object.fromEntries(Object.entries(fontSizeConfig).map(([name, value]) => [
    `--font-size-${fontSizeNames[name] || name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}`,
    value
  ]));
  const readPercent = (value, fallback) => {
    const number = Number(value);
    return Number.isFinite(number) ? Math.max(0, Math.min(40, number)) : fallback;
  };
  const shineThickness = readPercent(colors.gold.shineThickness, 2);
  const shineSpread = Math.max(shineThickness, readPercent(colors.gold.shineSpread, 12));
  const centeredStop = (offset) => `calc(50% ${offset < 0 ? "-" : "+"} ${Math.abs(offset).toFixed(2)}%)`;
  const shineCoreHalf = shineThickness / 2;
  const shineSpreadHalf = shineSpread / 2;
  const shineSoftHalf = (shineCoreHalf + shineSpreadHalf) / 2;
  const tokens = {
    ...typographyTokens,
    "--bg": colors.background.page,
    "--font-family-body": theme.familiasFonte?.texto || '"DM Sans", sans-serif',
    "--font-family-display": theme.familiasFonte?.titulos || '"Cormorant Garamond", Georgia, serif',
    "--surface": colors.background.surface,
    "--subtle": colors.background.section,
    "--line": colors.background.border,
    "--ink": colors.text.primary,
    "--muted": colors.text.secondary,
    "--gold-deep": colors.gold.deep,
    "--gold": colors.gold.base,
    "--gold-light": colors.gold.light,
    "--gold-highlight": colors.gold.highlight,
    "--gold-shine-color": colors.gold.shine || colors.gold.highlight,
    "--gold-shine-angle": theme.goldShineAngle || "90deg",
    "--gold-shine-spread-start": centeredStop(-shineSpreadHalf),
    "--gold-shine-soft-start": centeredStop(-shineSoftHalf),
    "--gold-shine-core-start": centeredStop(-shineCoreHalf),
    "--gold-shine-core-end": centeredStop(shineCoreHalf),
    "--gold-shine-soft-end": centeredStop(shineSoftHalf),
    "--gold-shine-spread-end": centeredStop(shineSpreadHalf),
    "--rose-strong": colors.rose.deep,
    "--rose": colors.rose.base,
    "--rose-light": colors.rose.light,
    "--rose-soft": colors.rose.soft,
    "--button-main": colors.buttons.primary,
    "--button-hover": colors.buttons.hover,
    "--button-text": colors.buttons.text,
    "--button-border": colors.buttons.border,
    "--button-glow": colors.buttons.glow,
    "--button-quiet-border": colors.buttons.quietBorder,
    "--button-quiet-bg": colors.buttons.quietBackground,
    "--button-quiet-text": colors.buttons.quietText
  };
  Object.entries(tokens).forEach(([variable, value]) => style.setProperty(variable, value));
  document.body.dataset.theme = mode;
  $$('[data-theme-choice]').forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.themeChoice === mode)));
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", colors.background.page);
}

function renderFooter(settings, navigation) {
  const pageLinks = navigation.map((page) => `<a href="#${escapeHTML(page.id)}">${escapeHTML(page.label)}</a>`).join("");
  $("#rodape").innerHTML = `<div class="footer-inner"><div class="footer-brand"><a class="brand" href="#inicio" aria-label="${escapeHTML(settings.brandName)}, início"><img class="footer-logo-image" src="img/logo.png" alt="${escapeHTML(settings.brandName)} — ${escapeHTML(settings.brandSubtitle)}" /></a><p>${escapeHTML(settings.footerText)}</p></div><div><h3 class="footer-title">${escapeHTML(settings.footerNavigationTitle)}</h3><nav class="footer-links" aria-label="Links do rodapé">${pageLinks}</nav></div><div><h3 class="footer-title">${escapeHTML(settings.footerSocialTitle)}</h3><div class="social-list">${renderSocials(settings)}</div></div></div><div class="footer-bottom"><span>© ${new Date().getFullYear()} ${escapeHTML(settings.brandName)}. ${escapeHTML(settings.copyrightText)}</span><a href="#topo">${escapeHTML(settings.backToTopLabel)} ↑</a></div>`;
}

function applySeo(seo, settings) {
  document.title = seo.title;
  document.documentElement.lang = seo.language || "pt-BR";
  const setMeta = (selector, value) => { const node = $(selector); if (node) node.setAttribute("content", value); };
  let seoImage = seo.image || "";
  try { seoImage = new URL(seoImage, seo.url || window.location.href).href; } catch { /* keep configured image if URL parsing is unavailable */ }
  setMeta('meta[name="description"]', seo.description);
  setMeta('meta[name="robots"]', seo.robots || "index,follow");
  setMeta('meta[name="keywords"]', (seo.keywords || []).join(", "));
  setMeta('meta[property="og:title"]', seo.title);
  setMeta('meta[property="og:description"]', seo.description);
  setMeta('meta[property="og:image"]', seoImage);
  setMeta('meta[property="og:image:alt"]', seo.imageAlt || `Logo ${settings.brandName}`);
  setMeta('meta[property="og:url"]', seo.url);
  setMeta('meta[property="og:site_name"]', settings.brandName);
  setMeta('meta[name="twitter:title"]', seo.title);
  setMeta('meta[name="twitter:description"]', seo.description);
  setMeta('meta[name="twitter:image"]', seoImage);
  setMeta('meta[name="twitter:image:alt"]', seo.imageAlt || `Logo ${settings.brandName}`);
  setMeta('link[rel="canonical"]', seo.url);
  if (!$('link[rel="canonical"]')) {
    const canonical = document.createElement("link"); canonical.rel = "canonical"; canonical.href = seo.url; document.head.append(canonical);
  } else $('link[rel="canonical"]').href = seo.url;
  const schema = { "@context": "https://schema.org", "@type": "HealthAndBeautyBusiness", name: settings.brandName, description: seo.description, image: seoImage, telephone: settings.contacts.phone, email: settings.contacts.email, url: seo.url, address: { "@type": "PostalAddress", streetAddress: settings.address.street, addressLocality: settings.address.city, addressRegion: settings.address.region, addressCountry: "BR" }, sameAs: settings.socials.map((social) => social.url).filter((url) => url && url !== "#") };
  let script = $('#business-schema');
  if (!script) { script = document.createElement("script"); script.id = "business-schema"; script.type = "application/ld+json"; document.head.append(script); }
  script.textContent = JSON.stringify(schema);
}

function setupInteractions(theme, navigation) {
  const savedTheme = localStorage.getItem("caroline-casini-theme");
  applyTheme(theme, savedTheme === "dark" ? "dark" : "light");
  $$('[data-theme-choice]').forEach((button) => button.addEventListener("click", () => {
    const mode = button.dataset.themeChoice;
    localStorage.setItem("caroline-casini-theme", mode);
    applyTheme(theme, mode);
  }));
  const menuToggle = $(".menu-toggle");
  menuToggle.addEventListener("click", () => {
    const open = menuToggle.getAttribute("aria-expanded") !== "true";
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    $("#main-nav").classList.toggle("is-open", open);
  });
  $$(".nav-link").forEach((link) => link.addEventListener("click", () => {
    $("#main-nav").classList.remove("is-open"); menuToggle.setAttribute("aria-expanded", "false"); menuToggle.setAttribute("aria-label", "Abrir menu");
  }));
  $$(".section-heading, .hero-copy, .hero-visual, .contact-copy, .contact-map, .address-map").forEach((element) => element.classList.add("reveal"));
  $$(".feature-card, .price-card, .stat, .contact-item").forEach((element, index) => {
    element.classList.add("reveal", `reveal-delay-${(index % 4) + 1}`);
  });
  $(".hero-visual")?.classList.add("reveal-delay-2");

  const goldTexts = $$(".gold-text");
  const goldShinePositions = new WeakMap();
  const parallaxTargets = [
    ...$$(".hero-photo, .editorial-image img, .model-photo img, .service-image img, .product-image img").map((element) => ({
      element,
      strength: element.matches(".hero-photo") ? .16 : .055,
      className: "parallax-media"
    })),
    ...$$(".hero-orbit, .hero-decoration, .hero-caption").map((element, index) => ({
      element,
      strength: [.035, .09, .065][index],
      className: "parallax-float"
    }))
  ];
  parallaxTargets.forEach(({ element, strength, className }) => {
    element.classList.add(className);
    element.dataset.parallaxStrength = String(strength);
  });

  const updateParallax = () => {
    const viewportCenter = window.innerHeight / 2;
    parallaxTargets.forEach(({ element }) => {
      const bounds = element.getBoundingClientRect();
      const distance = bounds.top + bounds.height / 2 - viewportCenter;
      const strength = Number(element.dataset.parallaxStrength) || 0;
      const offset = Math.max(-34, Math.min(34, -distance * strength));
      element.style.setProperty("--parallax-y", `${offset.toFixed(1)}px`);
    });
  };

  let previousScrollY = window.scrollY;
  let scrollFrame = 0;
  const onScroll = () => {
    if (scrollFrame) return;
    scrollFrame = requestAnimationFrame(() => {
      scrollFrame = 0;
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - previousScrollY;
      if (Math.abs(delta) < 1) return;
      previousScrollY = currentScrollY;
      document.body.dataset.scrollDirection = delta > 0 ? "down" : "up";
      updateParallax();

      const visibleGoldTexts = goldTexts.filter((element) => {
        const bounds = element.getBoundingClientRect();
        return bounds.bottom > 0 && bounds.top < window.innerHeight;
      });
      visibleGoldTexts.forEach((element) => {
        let position = goldShinePositions.get(element);
        if (position === undefined) position = 50;
        position = Math.max(0, Math.min(100, position - delta * .1));
        goldShinePositions.set(element, position);
        element.style.setProperty("--gold-shimmer-position", `${position.toFixed(2)}%`);
      });
    });
  };
  updateParallax();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", updateParallax, { passive: true });

  const sections = $$('[data-page-type]');
  if ("IntersectionObserver" in window) {
    let revealSerial = 0;
    const revealObserver = new IntersectionObserver((entries) => entries.forEach((entry) => {
      const target = entry.target;
      if (entry.isIntersecting) {
        const token = String(++revealSerial);
        target.dataset.revealToken = token;
        requestAnimationFrame(() => requestAnimationFrame(() => {
          if (target.isConnected && target.dataset.revealToken === token) {
            target.classList.add("is-visible");
            delete target.dataset.revealToken;
          }
        }));
      } else {
        delete target.dataset.revealToken;
        target.classList.remove("is-visible");
      }
    }), { threshold: .025, rootMargin: "0px 0px -5% 0px" });
    $$(".reveal").forEach((item) => revealObserver.observe(item));
    const navObserver = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      $$(".nav-link").forEach((link) => link.classList.toggle("is-active", link.hash === `#${entry.target.id}`));
    }), { rootMargin: "-35% 0px -55% 0px" });
    sections.forEach((section) => navObserver.observe(section));
  } else {
    const revealVisible = () => {
      $$(".reveal:not(.is-visible)").forEach((item) => {
        const bounds = item.getBoundingClientRect();
        if (bounds.top < window.innerHeight * .92 && bounds.bottom > 0) {
          requestAnimationFrame(() => item.classList.add("is-visible"));
        }
      });
      $$(".reveal.is-visible").forEach((item) => {
        const bounds = item.getBoundingClientRect();
        if (bounds.bottom <= 0 || bounds.top >= window.innerHeight) item.classList.remove("is-visible");
      });
    };
    revealVisible();
    window.addEventListener("scroll", revealVisible, { passive: true });
  }
}

async function init() {
  try {
    const entries = await Promise.all(FILES.map(async (name) => [name, await readMarkdown(name)]));
    const data = Object.fromEntries(entries);
    const settings = data.settings;
    $("[data-brand]").textContent = settings.brandName;
    $("[data-brand-subtitle]").textContent = settings.brandSubtitle;
    $(".header-cta").firstChild.textContent = `${settings.headerCtaLabel || "Agendar"} `;
    $$("[data-whatsapp]").forEach((link) => { link.href = waUrl(settings); link.target = "_blank"; link.rel = "noopener noreferrer"; });
    $$("[data-whatsapp-prompt-message]").forEach((link) => { link.textContent = settings.whatsappCalloutText || "Clique no botão e tenha um atendimento personalizado com a Caroline."; });
    const whatsappPrompt = $("[data-whatsapp-prompt]");
    const dismissWhatsAppPrompt = () => {
      if (!whatsappPrompt) return;
      whatsappPrompt.classList.add("is-dismissed");
      window.setTimeout(() => whatsappPrompt.remove(), 350);
    };
    $("[data-whatsapp-prompt-dismiss]")?.addEventListener("click", dismissWhatsAppPrompt);
    const pages = renderNavigation(data.navigation);
    const renderers = { home: renderHome, about: renderAbout, clinic: renderClinic, services: renderServices, models: renderModels, products: renderProducts, contact: renderContact, custom: renderCustom };
    const visiblePages = data.navigation.pages.filter((page) => page.enabled !== false);
    $("#page-content").innerHTML = visiblePages.map((page) => {
      const render = renderers[page.type];
      return render ? render(page, data, settings) : sectionShell(page, `<div class="section-heading"><p class="eyebrow">${escapeHTML(page.eyebrow || settings.genericEyebrow)}</p><h2>${escapeHTML(page.title || page.label)}</h2><p class="lead">${escapeHTML(page.description || "")}</p></div>`, "soft-section");
    }).join("");
    renderFooter(settings, pages);
    applySeo(data.seo, settings);
    setupInteractions(data.theme, pages);
  } catch (error) {
    console.error(error);
    $("#page-content").innerHTML = `<section class="section"><div class="section-inner empty-state"><h2>Não foi possível carregar o conteúdo</h2><p>Abra o site por um servidor local para que o navegador possa ler os arquivos Markdown em <strong>content/</strong>.</p><p>Para instruções rápidas, consulte <strong>README.md</strong>.</p></div></section>`;
  }
}

init();
