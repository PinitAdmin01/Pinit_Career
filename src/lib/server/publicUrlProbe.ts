import dns from 'dns';
import https from 'https';
import net from 'net';
import type { LookupAddress } from 'dns';

/**
 * Server-side checks that a link a student submitted really exists on the public internet.
 * Only https, only public hosts: every connection resolves the host through `publicOnlyLookup`,
 * which refuses private, loopback, link-local and other internal addresses (so a submitted
 * "live URL" can never make the server call something inside its own network), including on
 * every redirect hop.
 */

export type ProbeResult =
  | { ok: true; status: number; finalUrl: string }
  | { ok: false; reason: 'INVALID_URL' | 'NOT_PUBLIC' | 'NOT_FOUND' | 'UNREACHABLE' | 'RATE_LIMITED'; status?: number };

const TIMEOUT_MS = 8000;
const MAX_REDIRECTS = 3;
const BLOCKED_HOST_SUFFIXES = ['.localhost', '.local', '.internal', '.lan', '.home', '.corp'];

function ipv4ToInt(ip: string): number {
  return ip.split('.').reduce((acc, part) => (acc << 8) + Number(part), 0) >>> 0;
}

function inIpv4Range(ip: string, base: string, bits: number): boolean {
  const mask = bits === 0 ? 0 : (~0 << (32 - bits)) >>> 0;
  return (ipv4ToInt(ip) & mask) === (ipv4ToInt(base) & mask);
}

const PRIVATE_IPV4: ReadonlyArray<[string, number]> = [
  ['0.0.0.0', 8], ['10.0.0.0', 8], ['100.64.0.0', 10], ['127.0.0.0', 8], ['169.254.0.0', 16],
  ['172.16.0.0', 12], ['192.0.0.0', 24], ['192.0.2.0', 24], ['192.168.0.0', 16], ['198.18.0.0', 15],
  ['198.51.100.0', 24], ['203.0.113.0', 24], ['224.0.0.0', 4], ['240.0.0.0', 4],
];

/** The eight 16-bit groups of a valid IPv6 address (handles "::" and a dotted IPv4 tail). */
function ipv6Groups(address: string): number[] {
  let a = address.toLowerCase().split('%')[0];
  const dotted = a.match(/(\d+\.\d+\.\d+\.\d+)$/);
  if (dotted) {
    const n = ipv4ToInt(dotted[1]);
    a = a.slice(0, -dotted[1].length) + `${(n >>> 16).toString(16)}:${(n & 0xffff).toString(16)}`;
  }
  const [head, tail] = a.split('::');
  const parse = (s: string | undefined) => (s ? s.split(':').map((g) => parseInt(g, 16)) : []);
  const h = parse(head);
  const t = parse(tail);
  return tail === undefined ? h : [...h, ...new Array(8 - h.length - t.length).fill(0), ...t];
}

const groupsToIpv4 = (hi: number, lo: number) => `${hi >> 8}.${hi & 0xff}.${lo >> 8}.${lo & 0xff}`;

/** True for any address a public website cannot have (private, loopback, link-local, reserved…). */
export function isNonPublicAddress(address: string): boolean {
  const family = net.isIP(address);
  if (family === 4) return PRIVATE_IPV4.some(([base, bits]) => inIpv4Range(address, base, bits));
  if (family !== 6) return true;
  const g = ipv6Groups(address);
  if (g.length !== 8) return true;
  // Addresses that carry an IPv4 address are judged by that IPv4 address:
  // ::ffff:a.b.c.d (mapped), 64:ff9b::a.b.c.d (NAT64, common on IPv6-only networks), 2002:aabb:ccdd:: (6to4).
  if (g.slice(0, 5).every((x) => x === 0) && g[5] === 0xffff) return isNonPublicAddress(groupsToIpv4(g[6], g[7]));
  if (g[0] === 0x64 && g[1] === 0xff9b && g.slice(2, 6).every((x) => x === 0)) return isNonPublicAddress(groupsToIpv4(g[6], g[7]));
  if (g[0] === 0x2002) return isNonPublicAddress(groupsToIpv4(g[1], g[2]));
  if (g.slice(0, 7).every((x) => x === 0)) return true; // :: and ::1 (and deprecated IPv4-compatible)
  if ((g[0] & 0xfe00) === 0xfc00) return true; // fc00::/7 unique local
  if ((g[0] & 0xffc0) === 0xfe80) return true; // fe80::/10 link-local
  if ((g[0] & 0xff00) === 0xff00) return true; // ff00::/8 multicast
  if (g[0] === 0x2001 && g[1] === 0x0db8) return true; // documentation
  if (g[0] === 0x64 && g[1] === 0xff9b) return true; // 64:ff9b:1::/48 local-use NAT64
  return false;
}

/** The URL if it is an https link to a public host name (no IP literals, no credentials, port 443). */
export function parsePublicHttpsUrl(raw: unknown): URL | null {
  if (typeof raw !== 'string' || raw.length > 2048) return null;
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    return null;
  }
  if (url.protocol !== 'https:' || url.username || url.password) return null;
  if (url.port && url.port !== '443') return null;
  const host = url.hostname.toLowerCase().replace(/\.$/, '');
  if (!host.includes('.') || net.isIP(host.replace(/^\[|\]$/g, ''))) return null;
  if (host === 'localhost' || BLOCKED_HOST_SUFFIXES.some((s) => host.endsWith(s))) return null;
  return url;
}

type LookupCallback = (err: NodeJS.ErrnoException | null, address: string | LookupAddress[], family?: number) => void;

/** dns.lookup that refuses to connect to anything that is not a public address. */
export function publicOnlyLookup(hostname: string, options: dns.LookupOptions, callback: LookupCallback): void {
  dns.lookup(hostname, { ...options, all: true }, (err, addresses) => {
    if (err) return callback(err, []);
    const list = addresses as LookupAddress[];
    if (list.length === 0 || list.some((a) => isNonPublicAddress(a.address))) {
      const blocked: NodeJS.ErrnoException = new Error(`Refusing non-public address for ${hostname}`);
      blocked.code = 'ENOTPUBLIC';
      return callback(blocked, []);
    }
    if (options.all) return callback(null, list);
    return callback(null, list[0].address, list[0].family);
  });
}

function requestOnce(url: URL): Promise<{ status: number; location: string | null } | { error: string }> {
  return new Promise((resolve) => {
    const req = https.request(url, {
      method: 'GET',
      lookup: publicOnlyLookup as unknown as typeof dns.lookup,
      timeout: TIMEOUT_MS,
      headers: { 'user-agent': 'PinIT-Capstone-Checker/1.0', accept: 'text/html,*/*' },
    }, (res) => {
      const location = typeof res.headers.location === 'string' ? res.headers.location : null;
      resolve({ status: res.statusCode || 0, location });
      res.destroy();
    });
    req.on('timeout', () => req.destroy(new Error('timeout')));
    req.on('error', (err: NodeJS.ErrnoException) => resolve({ error: err.code || err.message }));
    req.end();
  });
}

/** GETs the URL (headers only), following up to 3 redirects, each re-checked as a public https link. */
export async function probePublicUrl(raw: string): Promise<ProbeResult> {
  let url = parsePublicHttpsUrl(raw);
  if (!url) return { ok: false, reason: 'INVALID_URL' };
  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    const res = await requestOnce(url);
    if ('error' in res) return { ok: false, reason: res.error === 'ENOTPUBLIC' ? 'NOT_PUBLIC' : 'UNREACHABLE' };
    if (res.status >= 300 && res.status < 400 && res.location) {
      let next: URL | null = null;
      try {
        next = parsePublicHttpsUrl(new URL(res.location, url).toString());
      } catch {
        next = null;
      }
      if (!next) return { ok: false, reason: 'NOT_PUBLIC', status: res.status };
      url = next;
      continue;
    }
    if (res.status === 429) return { ok: false, reason: 'RATE_LIMITED', status: res.status };
    // 401/403: the site is up but asks for a login or blocks bots; that still proves it is deployed.
    if (res.status < 400 || res.status === 401 || res.status === 403) return { ok: true, status: res.status, finalUrl: url.toString() };
    if (res.status === 404 || res.status === 410) return { ok: false, reason: 'NOT_FOUND', status: res.status };
    return { ok: false, reason: 'UNREACHABLE', status: res.status };
  }
  return { ok: false, reason: 'UNREACHABLE' };
}
