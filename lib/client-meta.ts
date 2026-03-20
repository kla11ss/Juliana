type ClientMetaInput = {
  startedAt?: string;
  submittedStepCount?: number;
};

export function collectClientMeta(input: ClientMetaInput = {}) {
  if (typeof window === "undefined") {
    return undefined;
  }

  const params = new URLSearchParams(window.location.search);
  const device =
    /Mobi|Android|iPhone|iPad/i.test(window.navigator.userAgent) ? "mobile" : "desktop";

  return {
    utmSource: params.get("utm_source") || undefined,
    utmMedium: params.get("utm_medium") || undefined,
    utmCampaign: params.get("utm_campaign") || undefined,
    referer: document.referrer || undefined,
    locale: window.navigator.language || undefined,
    device,
    startedAt: input.startedAt,
    submittedStepCount: input.submittedStepCount
  };
}
