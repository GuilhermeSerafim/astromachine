type PlatformOS = 'ios' | 'android' | 'windows' | 'macos' | 'web';

interface ApiBaseUrlOptions {
  platformOS: PlatformOS | string;
  expoHost?: string | null;
  bundleHost?: string | null;
  envUrl?: string | null;
  port?: string;
}

const DEFAULT_PORT = '3001';

export function normalizeBaseUrl(url?: string | null): string | null {
  if (!url || typeof url !== 'string') {
    return null;
  }

  const trimmedUrl = url.trim().replace(/\/$/, '');
  if (!trimmedUrl || !/^https?:\/\//i.test(trimmedUrl)) {
    return null;
  }

  return trimmedUrl;
}

function buildUrlFromHost(host?: string | null, port = DEFAULT_PORT): string | null {
  if (!host || typeof host !== 'string') {
    return null;
  }

  const sanitizedHost = host.trim().replace(/^https?:\/\//i, '').replace(/\/.*$/, '').replace(/:\d+$/, '');
  if (!sanitizedHost) {
    return null;
  }

  return `http://${sanitizedHost}:${port}`;
}

export function getApiBaseUrlCandidates(options: ApiBaseUrlOptions): string[] {
  const port = options.port || DEFAULT_PORT;
  const platformOS = options.platformOS;
  const expoHostUrl = buildUrlFromHost(options.expoHost, port);
  const bundleHostUrl = buildUrlFromHost(options.bundleHost, port);
  const envUrl = normalizeBaseUrl(options.envUrl ?? process.env.EXPO_PUBLIC_API_URL);
  const emulatorUrl = platformOS === 'android' ? `http://10.0.2.2:${port}` : null;
  const localhostUrl = `http://localhost:${port}`;

  return [expoHostUrl, bundleHostUrl, envUrl, emulatorUrl, localhostUrl].filter(
    (value, index, array): value is string => Boolean(value) && array.indexOf(value) === index
  );
}
