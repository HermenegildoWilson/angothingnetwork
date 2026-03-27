import { CookieOptions } from '../types/cookie-options';

export const parseCookies = (cookieHeader?: string) => {
  const cookies: Record<string, string> = {};
  if (!cookieHeader) return cookies;
  for (const part of cookieHeader.split(';')) {
    const [rawName, ...rest] = part.split('=');
    const name = rawName?.trim();
    if (!name) continue;
    cookies[name] = decodeURIComponent(rest.join('=').trim());
  }
  return cookies;
};

export const serializeCookie = (
  name: string,
  value: string,
  options: CookieOptions = {},
) => {
  let cookie = `${name}=${encodeURIComponent(value)}`;

  if (options.maxAge !== undefined) {
    cookie += `; Max-Age=${Math.floor(options.maxAge / 1000)}`;
  }
  if (options.expires) {
    cookie += `; Expires=${options.expires.toUTCString()}`;
  }
  if (options.httpOnly) cookie += '; HttpOnly';
  if (options.secure) cookie += '; Secure';
  if (options.sameSite) cookie += `; SameSite=${options.sameSite}`;
  if (options.path) cookie += `; Path=${options.path}`;
  return cookie;
};
