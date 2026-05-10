# HANTA.BANDORS.ORG

Live Hantavirus tracker for the MV Hondius / Andes virus outbreak.

The site combines official case status, mainstream news, a timeline, a world signal map, a small ship tracker graphic, Polymarket odds, and a 1990s-style visitor counter.

## Launch

Announcement tweet from Bandors:

> "I whipped up a Hantavirus tracker..."

https://x.com/oscpmentor/status/2053118155162259517

## Stack

- Next.js static export
- React
- Plain CSS
- Python sidecar API for visitor counts, news feed parsing, and Polymarket data
- Caddy for HTTPS, static hosting, security headers, and `/api/*` proxying

## Local Development

```bash
npm install
npm run dev
```

Build the static export:

```bash
npm run build
```

The exported site is written to `out/`.

## Server Notes

The static site can be served by any web server. The optional sidecar API is in `server/view_counter.py` and should bind to `127.0.0.1` behind a reverse proxy.

Do not commit local deployment files such as SSH keys, `.env` files, `ip.txt`, `.next/`, `out/`, or `node_modules/`. They are excluded in `.gitignore`.

