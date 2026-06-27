export const isBlackRelayUrl = (href: string) => {
  if (href.startsWith("/") || href.startsWith("#")) {
    return true;
  }

  try {
    const { hostname } = new URL(href);
    const normalisedHost = hostname.toLowerCase();

    return (
      normalisedHost === "blackrelay.network" ||
      normalisedHost.endsWith(".blackrelay.network")
    );
  } catch {
    return false;
  }
};

export const externalLinkAttrs = (href: string) =>
  isBlackRelayUrl(href) ? {} : { target: "_blank", rel: "noopener noreferrer" };
