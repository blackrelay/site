export const siteConfig = {
  name: "Black Relay",
  domain: "blackrelay.network",
  description:
    "Black Relay is an EVE Frontier relay network for public data, route intelligence, logistics and field operations.",
  // Public invite/referral values only. These are not secrets and should not use private environment variables.
  discordInviteUrl: "https://discord.gg/mvG5nmDU95",
  eveFrontierReferralUrl: "https://evefrontier.com/en?ref=blackrelay",
  eveFrontierReferralCode: "blackrelay",
  githubOrgUrl: "https://github.com/blackrelay",
  identity: {
    founderName: "Hēi",
    founderUrl: "https://github.com/heinotfound",
    founderLoreName: "Hei Warden",
    founderTitle: "The One True Seer",
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
    registry: "BUILDING",
    api: "BUILDING",
    docs: "BUILDING",
    status: "BOOTSTRAPPING",
  },
} as const;

export const navItems = [
  { label: "HOME", href: "/" },
  { label: "REGISTRY", href: siteConfig.endpoints.registry },
  { label: "API", href: siteConfig.endpoints.api },
  { label: "API DOCS", href: siteConfig.endpoints.docs },
  { label: "STATUS", href: siteConfig.endpoints.status },
  { label: "COMMS", href: siteConfig.discordInviteUrl },
] as const;
