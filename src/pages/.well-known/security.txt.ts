import { siteConfig } from "../../config/site";

const canonicalUrl = `https://${siteConfig.domain}/.well-known/security.txt`;
const policyUrl = `https://${siteConfig.domain}/security/`;

const securityTxt = `Contact: mailto:hei@blackrelay.network
Expires: 2027-01-01T00:00:00Z
Preferred-Languages: en
Policy: ${policyUrl}
Canonical: ${canonicalUrl}
`;

export function GET() {
  return new Response(securityTxt, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
