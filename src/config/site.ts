export const siteConfig = {
  name: "Black Relay",
  domain: "blackrelay.network",
  description:
    "Public EVE Frontier API, Registry and developer docs for source-labelled data from Sui events, World API metadata and static client data.",
  // Public invite/referral values only. These are not secrets and should not use private environment variables.
  discordInviteUrl: "https://discord.gg/mvG5nmDU95",
  eveFrontierReferralUrl: "https://evefrontier.com/en?ref=blackrelay",
  eveFrontierReferralCode: "blackrelay",
  githubOrgUrl: "https://github.com/blackrelay",
  statusApiUrl: "https://status.blackrelay.network/api/status.json",
  identity: {
    founderName: "Hēi",
    founderUrl: "https://github.com/heinotfound",
    operatorGroup: "The Seers",
    operatorGroupUrl: "https://github.com/orgs/blackrelay/people",
    formalMaintainerLead:
      "Black Relay is an independent EVE Frontier community infrastructure maintained by",
    contributorsLabel: "contributors",
    contributorsUrl: "https://github.com/orgs/blackrelay/people",
  },
  endpoints: {
    registry: "https://registry.blackrelay.network",
    api: "https://api.blackrelay.network",
    docs: "https://docs.blackrelay.network",
    status: "https://status.blackrelay.network",
  },
  systemStates: {
    registry: "CHECKING",
    api: "CHECKING",
    docs: "CHECKING",
    status: "CHECKING",
  },
} as const;

export const navItems = [
  { label: "Home", href: "/" },
  { label: "Registry", href: siteConfig.endpoints.registry },
  { label: "API", href: siteConfig.endpoints.api },
  { label: "Docs", href: siteConfig.endpoints.docs },
  { label: "Status", href: siteConfig.endpoints.status },
  { label: "GitHub", href: siteConfig.githubOrgUrl },
  { label: "Discord", href: siteConfig.discordInviteUrl },
] as const;
