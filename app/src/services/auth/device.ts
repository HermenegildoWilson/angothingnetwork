import { deviceDto } from "./types";

const DEVICE_ID_KEY = "device_id";
const GEO_CACHE_KEY = "device_geo";
const GEO_TTL_MS = 12 * 60 * 60 * 1000;

const getStorage = () => {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
};

const getOrCreateDeviceId = () => {
  const storage = getStorage();
  if (!storage) return "web-device";

  const existing = storage.getItem(DEVICE_ID_KEY);
  if (existing) return existing;

  const newId =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `web-${Date.now()}-${Math.random().toString(16).slice(2)}`;

  storage.setItem(DEVICE_ID_KEY, newId);
  return newId;
};

type GeoInfo = {
  ipAddress: string;
  country: string;
  city: string;
};

const getLocaleCountry = () => {
  const locale =
    typeof navigator !== "undefined" ? navigator.language : undefined;
  if (!locale) return "unknown";
  const parts = locale.split("-");
  return parts[1] ? parts[1].toUpperCase() : "unknown";
};

const getCityFromTimezone = () => {
  if (typeof Intl === "undefined") return "unknown";
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (!tz) return "unknown";
  const parts = tz.split("/");
  const city = parts[parts.length - 1] ?? "unknown";
  return city.replace(/_/g, " ");
};

const guessGeo = (): GeoInfo => ({
  ipAddress: "unknown",
  country: getLocaleCountry(),
  city: getCityFromTimezone(),
});

const getGeoFromCache = () => {
  const storage = getStorage();
  if (!storage) return null;
  try {
    const raw = storage.getItem(GEO_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { ts: number; data: GeoInfo };
    if (!parsed || typeof parsed.ts !== "number") return null;
    if (Date.now() - parsed.ts > GEO_TTL_MS) return null;
    return parsed.data;
  } catch {
    return null;
  }
};

const setGeoCache = (data: GeoInfo) => {
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.setItem(GEO_CACHE_KEY, JSON.stringify({ ts: Date.now(), data }));
  } catch {
    // ignore cache errors
  }
};

const fetchGeoInfo = async (): Promise<GeoInfo | null> => {
  if (typeof fetch === "undefined") return null;
  try {
    const response = await fetch("https://ipapi.co/json/");
    if (!response.ok) return null;
    const data = (await response.json()) as {
      ip?: string;
      city?: string;
      country_code?: string;
      country?: string;
    };
    const ipAddress = data.ip ?? "unknown";
    const country = (data.country_code ?? data.country ?? "unknown").toString();
    const city = (data.city ?? "unknown").toString();

    if (!ipAddress || !country || !city) return null;

    return { ipAddress, country, city };
  } catch {
    return null;
  }
};

const detectBrowser = (ua: string) => {
  if (/Edg\//.test(ua)) return "Edge";
  if (/OPR\//.test(ua) || /Opera/.test(ua)) return "Opera";
  if (/Chrome\//.test(ua) && !/Edg\//.test(ua)) return "Chrome";
  if (/Safari\//.test(ua) && !/Chrome\//.test(ua)) return "Safari";
  if (/Firefox\//.test(ua)) return "Firefox";
  if (/MSIE|Trident/.test(ua)) return "IE";
  return "Unknown";
};

const detectOs = (ua: string) => {
  if (/Windows NT/.test(ua)) return "Windows";
  if (/Android/.test(ua)) return "Android";
  if (/iPhone|iPad|iPod/.test(ua)) return "iOS";
  if (/Mac OS X/.test(ua)) return "macOS";
  if (/CrOS/.test(ua)) return "ChromeOS";
  if (/Linux/.test(ua)) return "Linux";
  return "Unknown";
};

const detectOsVersion = (ua: string) => {
  const windows = /Windows NT (\d+\.\d+)/.exec(ua);
  if (windows?.[1]) {
    const versionMap: Record<string, string> = {
      "10.0": "10",
      "6.3": "8.1",
      "6.2": "8",
      "6.1": "7",
      "6.0": "Vista",
      "5.1": "XP",
    };
    return versionMap[windows[1]] ?? windows[1];
  }

  const android = /Android (\d+(?:\.\d+)+)/.exec(ua);
  if (android?.[1]) return android[1];

  const ios = /OS (\d+[_\d]*)/.exec(ua);
  if (ios?.[1]) return ios[1].replace(/_/g, ".");

  const mac = /Mac OS X (\d+[_\d]*)/.exec(ua);
  if (mac?.[1]) return mac[1].replace(/_/g, ".");

  return "unknown";
};

const detectModel = (ua: string) => {
  if (/iPhone/.test(ua)) return "iPhone";
  if (/iPad/.test(ua)) return "iPad";
  if (/iPod/.test(ua)) return "iPod";
  const androidModel = /Android.*;\s*([^;]+)\s*Build/.exec(ua);
  if (androidModel?.[1]) return androidModel[1].trim();
  if (/Macintosh/.test(ua)) return "Mac";
  if (/Windows/.test(ua)) return "PC";
  if (/Linux/.test(ua)) return "Linux";
  return "Desktop";
};

const detectBrand = (ua: string) => {
  if (/iPhone|iPad|iPod|Mac/.test(ua)) return "Apple";
  if (/Android/.test(ua)) return "Android";
  if (/Windows/.test(ua)) return "Microsoft";
  if (/Linux/.test(ua)) return "Linux";
  return "Web";
};

type NavigatorWithUAData = Navigator & {
  userAgentData?: {
    platform?: string;
  };
};

const buildBaseDeviceDto = (): deviceDto => {
  const navigatorInfo =
    typeof navigator !== "undefined"
      ? (navigator as NavigatorWithUAData)
      : null;
  const userAgent = navigatorInfo?.userAgent ?? "unknown";
  const platform =
    navigatorInfo?.userAgentData?.platform ?? navigatorInfo?.platform ?? "web";

  const os = detectOs(userAgent);
  const osVersion = detectOsVersion(userAgent);

  return {
    deviceId: getOrCreateDeviceId(),
    userAgent,
    platform,
    os,
    browser: detectBrowser(userAgent),
    ipAddress: "unknown",
    brand: detectBrand(userAgent),
    model: detectModel(userAgent),
    osVersion,
    appVersion: import.meta.env.VITE_APP_VERSION ?? "dev",
    country: getLocaleCountry(),
    city: getCityFromTimezone(),
  };
};

export const buildWebDeviceDtoSync = (): deviceDto => {
  const base = buildBaseDeviceDto();
  const cachedGeo = getGeoFromCache();
  return cachedGeo ? { ...base, ...cachedGeo } : base;
};

export const buildWebDeviceDto = async (): Promise<deviceDto> => {
  const base = buildBaseDeviceDto();
  const cachedGeo = getGeoFromCache();
  if (cachedGeo) {
    return { ...base, ...cachedGeo };
  }
  const fetched = await fetchGeoInfo();
  if (fetched) {
    setGeoCache(fetched);
    return { ...base, ...fetched };
  }
  return { ...base, ...guessGeo() };
};
