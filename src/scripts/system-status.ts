type StatusState = "online" | "service_bad" | "offline" | "unknown";

export {};

type ServiceStatus = {
  id: string;
  status: StatusState;
  displayStatus: string;
  summary?: string;
};

type StatusPayload = {
  services?: ServiceStatus[];
};

declare global {
  interface Window {
    BLACK_RELAY_STATUS_API_URL?: string;
  }
}

function toneForStatus(status: StatusState): string {
  if (status === "online" || status === "service_bad" || status === "offline") {
    return status;
  }
  return "default";
}

async function loadSystemStatus(): Promise<void> {
  const endpoint = window.BLACK_RELAY_STATUS_API_URL ?? "https://status.blackrelay.network/api/status.json";
  const response = await fetch(endpoint, {
    headers: {
      accept: "application/json",
    },
  });
  if (!response.ok) {
    throw new Error(`Status API returned ${response.status}`);
  }
  const payload = (await response.json()) as StatusPayload;
  const services = new Map((payload.services ?? []).map((service) => [service.id, service]));

  for (const card of document.querySelectorAll<HTMLElement>("[data-status-card]")) {
    const service = services.get(card.dataset.statusCard ?? "");
    const target = card.querySelector<HTMLElement>("[data-status-state]");
    if (!service || !target) {
      continue;
    }
    card.dataset.stateTone = toneForStatus(service.status);
    target.textContent = service.displayStatus;
    if (service.summary) {
      target.title = service.summary;
    }
  }
}

void loadSystemStatus().catch(() => {
  for (const card of document.querySelectorAll<HTMLElement>("[data-status-card]")) {
    const target = card.querySelector<HTMLElement>("[data-status-state]");
    card.dataset.stateTone = "service_bad";
    if (target) {
      target.textContent = "SERVICE BAD";
      target.title = "Status API unavailable.";
    }
  }
});
