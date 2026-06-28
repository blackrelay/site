import { securityPolicyMarkdown } from "../content/security-policy";

export function GET() {
  return new Response(securityPolicyMarkdown, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
