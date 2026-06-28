const READ_ONLY_METHODS = new Set(["GET", "HEAD"]);
const READ_ONLY_ALLOW_HEADER = "GET, HEAD";
const MARKDOWN_MAX_HTML_BYTES = 2_097_152;

const DICTIONARY_ASSET_MATCHES = [
  { prefix: "/_astro/", suffix: ".css", match: "/_astro/*.css" },
  { prefix: "/_astro/", suffix: ".js", match: "/_astro/*.js" },
];

const HOME_DISCOVERY_LINK_HEADER = [
  '</llms.txt>; rel="describedby"; type="text/plain"; title="Black Relay site overview"',
  '</security.md>; rel="describedby"; type="text/markdown"; title="Black Relay site security policy"',
  '</.well-known/security.txt>; rel="security"; type="text/plain"; title="Security contact"',
].join(", ");

const STATIC_CSP = [
  "upgrade-insecure-requests",
  "default-src 'none'",
  "script-src 'self' https://static.cloudflareinsights.com/beacon.min.js https://ajax.cloudflare.com",
  "script-src-attr 'none'",
  "style-src 'self'",
  "style-src-attr 'none'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self' https://cloudflareinsights.com https://status.blackrelay.network",
  "frame-src 'none'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "object-src 'none'",
  "manifest-src 'self'",
  "worker-src 'none'",
].join("; ");

const HTML_ENTITY_MAP = new Map([
  ["amp", "&"],
  ["apos", "'"],
  ["gt", ">"],
  ["lt", "<"],
  ["nbsp", " "],
  ["quot", '"'],
]);

function llmsTxt() {
  return `# Black Relay

Black Relay is an EVE Frontier relay network for public data, route intelligence, logistics and field operations.

Primary URLs:
- Home: https://blackrelay.network/
- API: https://api.blackrelay.network/
- Registry: https://registry.blackrelay.network/
- API docs: https://docs.blackrelay.network/
- Status: https://status.blackrelay.network/
- Comms: https://discord.gg/mvG5nmDU95

Security policy:
- https://blackrelay.network/security/
- https://blackrelay.network/security.md
- https://blackrelay.network/.well-known/security.txt
`;
}

function createNonce() {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);

  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary);
}

function buildHtmlCsp(nonce) {
  return [
    "upgrade-insecure-requests",
    "default-src 'none'",
    `script-src 'self' 'nonce-${nonce}' https://static.cloudflareinsights.com/beacon.min.js https://ajax.cloudflare.com`,
    "script-src-attr 'none'",
    `style-src 'self' 'nonce-${nonce}'`,
    "style-src-attr 'none'",
    "img-src 'self' data:",
    "font-src 'self'",
    "connect-src 'self' https://cloudflareinsights.com https://status.blackrelay.network",
    "frame-src 'none'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "object-src 'none'",
    "manifest-src 'self'",
    "worker-src 'none'",
  ].join("; ");
}

class ScriptAttributeHandler {
  constructor(nonce) {
    this.nonce = nonce;
  }

  element(element) {
    element.setAttribute("data-cfasync", "false");
    element.setAttribute("nonce", this.nonce);
  }
}

class NonceAttributeHandler {
  constructor(nonce) {
    this.nonce = nonce;
  }

  element(element) {
    element.setAttribute("nonce", this.nonce);
  }
}

function isHtmlResponse(response) {
  const contentType = response.headers.get("Content-Type") ?? "";
  return contentType.includes("text/html");
}

function isHomepage(url) {
  return url.pathname === "/" || url.pathname === "/index.html";
}

function requestAcceptsMarkdown(request) {
  const url = new URL(request.url);
  const format = url.searchParams.get("format") ?? url.searchParams.get("view");
  if (format === "markdown" || format === "md") {
    return true;
  }

  const accept = request.headers.get("Accept") ?? "";
  return accept
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .some((value) => {
      const [type, ...parameters] = value.split(";").map((part) => part.trim());
      if (type !== "text/markdown") {
        return false;
      }

      return !parameters.some((parameter) => /^q=0(?:\.0+)?$/.test(parameter));
    });
}

function getDictionaryMatch(pathname) {
  return DICTIONARY_ASSET_MATCHES.find(
    ({ prefix, suffix }) => pathname.startsWith(prefix) && pathname.endsWith(suffix),
  )?.match;
}

function getCacheControl(url, response) {
  if (isHtmlResponse(response)) {
    return "public, max-age=0, must-revalidate";
  }

  if (url.pathname.startsWith("/_astro/")) {
    return "public, max-age=31536000, immutable";
  }

  if (
    url.pathname === "/robots.txt" ||
    url.pathname === "/security.md" ||
    url.pathname === "/llms.txt" ||
    url.pathname.startsWith("/.well-known/")
  ) {
    return "public, max-age=3600";
  }

  return "public, max-age=0, must-revalidate";
}

function appendVaryHeader(headers, value) {
  const existing = headers.get("Vary");
  if (!existing) {
    headers.set("Vary", value);
    return;
  }

  if (existing.trim() === "*") {
    return;
  }

  const values = existing
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
  const hasValue = values.some((entry) => entry.toLowerCase() === value.toLowerCase());

  if (!hasValue) {
    values.push(value);
    headers.set("Vary", values.join(", "));
  }
}

function withCommonHeaders(response, url) {
  const headers = new Headers(response.headers);

  headers.delete("Content-Security-Policy-Report-Only");
  headers.delete("Report-To");
  headers.set("Cache-Control", getCacheControl(url, response));
  headers.set("Cross-Origin-Opener-Policy", "same-origin");
  headers.set("Cross-Origin-Resource-Policy", "same-origin");
  headers.set("Permissions-Policy", "geolocation=(), microphone=(), camera=(), payment=(), usb=()");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("X-Frame-Options", "DENY");
  headers.set("X-XSS-Protection", "0");
  appendVaryHeader(headers, "Accept-Encoding");

  if (isHtmlResponse(response)) {
    appendVaryHeader(headers, "Accept");
  }

  const dictionaryMatch = getDictionaryMatch(url.pathname);
  if (dictionaryMatch && response.status === 200) {
    headers.set("Use-As-Dictionary", `match="${dictionaryMatch}", type=raw`);
  }

  if (isHomepage(url) && response.status === 200) {
    headers.set("Link", HOME_DISCOVERY_LINK_HEADER);
  }

  if (!isHtmlResponse(response)) {
    headers.set("Content-Security-Policy", STATIC_CSP);
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  }

  const nonce = createNonce();
  headers.set("Content-Security-Policy", buildHtmlCsp(nonce));

  const rewrittenResponse = new HTMLRewriter()
    .on("script", new ScriptAttributeHandler(nonce))
    .on("style", new NonceAttributeHandler(nonce))
    .transform(response);

  return new Response(rewrittenResponse.body, {
    status: rewrittenResponse.status,
    statusText: rewrittenResponse.statusText,
    headers,
  });
}

function decodeHtmlEntities(text) {
  return text.replace(/&(#x[0-9a-f]+|#[0-9]+|[a-z][a-z0-9]+);/gi, (match, entity) => {
    const normalizedEntity = entity.toLowerCase();

    if (normalizedEntity.startsWith("#x")) {
      const codePoint = Number.parseInt(normalizedEntity.slice(2), 16);
      return Number.isFinite(codePoint) ? String.fromCodePoint(codePoint) : match;
    }

    if (normalizedEntity.startsWith("#")) {
      const codePoint = Number.parseInt(normalizedEntity.slice(1), 10);
      return Number.isFinite(codePoint) ? String.fromCodePoint(codePoint) : match;
    }

    return HTML_ENTITY_MAP.get(normalizedEntity) ?? match;
  });
}

function normalizeMarkdown(markdown) {
  return markdown
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .concat("\n");
}

function stripAttributes(html, tagName) {
  return html.replace(new RegExp(`<${tagName}\\b[^>]*>`, "gi"), `<${tagName}>`);
}

function markdownFromHtml(html, url) {
  let fragment = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] ?? html;

  fragment = fragment
    .replace(/<script\b[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[\s\S]*?<\/style>/gi, "")
    .replace(/<svg\b[\s\S]*?<\/svg>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<p\b[^>]*>/gi, "")
    .replace(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi, "\n# $1\n\n")
    .replace(/<h2\b[^>]*>([\s\S]*?)<\/h2>/gi, "\n## $1\n\n")
    .replace(/<h3\b[^>]*>([\s\S]*?)<\/h3>/gi, "\n### $1\n\n")
    .replace(/<li\b[^>]*>([\s\S]*?)<\/li>/gi, "\n- $1")
    .replace(/<\/?(ul|ol)\b[^>]*>/gi, "\n")
    .replace(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi, (_match, href, label) => {
      const absoluteUrl = new URL(href, url).toString();
      return `[${label.trim()}](${absoluteUrl})`;
    });

  for (const tagName of ["span", "div", "section", "article", "aside", "strong", "em"]) {
    fragment = stripAttributes(fragment, tagName)
      .replace(new RegExp(`<${tagName}>`, "gi"), "")
      .replace(new RegExp(`</${tagName}>`, "gi"), "");
  }

  fragment = fragment.replace(/<[^>]+>/g, "");

  return normalizeMarkdown(decodeHtmlEntities(fragment));
}

async function markdownResponseFromHtml(response, url, method) {
  const lengthHeader = response.headers.get("Content-Length");
  const contentLength = lengthHeader ? Number.parseInt(lengthHeader, 10) : 0;
  if (Number.isFinite(contentLength) && contentLength > MARKDOWN_MAX_HTML_BYTES) {
    return new Response("HTML response is too large to convert to Markdown.\n", {
      status: 413,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const html = await response.text();
  if (html.length > MARKDOWN_MAX_HTML_BYTES) {
    return new Response("HTML response is too large to convert to Markdown.\n", {
      status: 413,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const markdown = markdownFromHtml(html, url);
  const headers = new Headers(response.headers);
  headers.set("Content-Type", "text/markdown; charset=utf-8");
  headers.set("X-Markdown-Source", url.pathname);
  headers.delete("Content-Length");
  appendVaryHeader(headers, "Accept");

  return new Response(method === "HEAD" ? null : markdown, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function simpleResponse(body, status, headers = {}) {
  return new Response(body, {
    status,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      ...headers,
    },
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (!READ_ONLY_METHODS.has(request.method)) {
      return withCommonHeaders(
        simpleResponse("Method not allowed.\n", 405, { Allow: READ_ONLY_ALLOW_HEADER }),
        url,
      );
    }

    if (url.pathname === "/llms.txt") {
      return withCommonHeaders(simpleResponse(llmsTxt(), 200), url);
    }

    let response = await env.ASSETS.fetch(request);

    if (requestAcceptsMarkdown(request) && isHtmlResponse(response) && response.status === 200) {
      response = await markdownResponseFromHtml(response, url, request.method);
    }

    return withCommonHeaders(response, url);
  },
};
