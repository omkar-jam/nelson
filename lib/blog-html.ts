import 'server-only';

/**
 * Wix blog SSR uses tiny LQIP URLs in `src` (often w_147 + blur_2) and puts the real file in
 * `data-pin-media`. Inline `position:absolute` + 100% sizing then blows up the thumbnail on our layout.
 * This normalizes images for display on our site.
 */
/**
 * Wix wraps content in <div class="wnwZD" style="--ricos-...var(--textParagraphColor-rgb)...">
 * Those variables only exist on Wix; without them, typography/colors fall apart. Strip the style
 * so our `.imported-blog-content` rules apply.
 */
function stripWixRicosRootStyle(html: string): string {
  let out = '';
  let last = 0;
  let pos = 0;
  const needle = 'class="wnwZD"';
  while ((pos = html.indexOf(needle, last)) !== -1) {
    const open = html.lastIndexOf('<div', pos);
    if (open === -1) {
      last = pos + needle.length;
      continue;
    }
    if (open < last) {
      last = pos + 1;
      continue;
    }
    const gt = html.indexOf('>', pos);
    if (gt === -1) break;
    out += html.slice(last, open);
    let tag = html.slice(open, gt + 1);
    tag = tag.replace(/\sstyle="[^"]*"/i, '');
    if (!tag.includes('imported-ricos-root')) {
      tag = tag.replace('class="wnwZD"', 'class="wnwZD imported-ricos-root"');
    }
    out += tag;
    last = gt + 1;
  }
  out += html.slice(last);
  return out;
}

export function fixImportedWixBlogHtml(html: string): string {
  if (!html) return html;

  let out = stripWixRicosRootStyle(html);
  out = flattenWixProGalleries(out);

  out = out
    .replace(/<wow-image[^>]*>/gi, '<div class="imported-wix-image">')
    .replace(/<\/wow-image>/gi, '</div>')
    /* Wix “expand” control — not wired on our site */
    .replace(/<button[^>]*data-hook="image-expand-button"[^>]*>[\s\S]*?<\/button>/gi, '');

  out = out.replace(/<img\b([^>]*)>/gi, (_, attrs: string) => {
    let a = attrs;

    const pin = a.match(/\bdata-pin-media=["']([^"']+)["']/i);
    if (pin?.[1]?.includes('wixstatic.com')) {
      let url = pin[1].replace(/,blur_2/g, '').replace(/blur_2,/g, '');
      url = upscaleWixFillUrl(url);
      if (/\ssrc=/i.test(a)) {
        a = a.replace(/\ssrc=["'][^"']*["']/i, ` src="${url}"`);
      } else {
        a = ` src="${url}"${a}`;
      }
    } else {
      a = a.replace(/\ssrc=(")([^"]*)(")/i, (_m, q1, url: string, q2) => {
        const fixed = fixWixImageUrl(url);
        return ` src=${q1}${fixed}${q2}`;
      });
      a = a.replace(/\ssrc=(')([^']*)(')/i, (_m, q1, url: string, q2) => {
        const fixed = fixWixImageUrl(url);
        return ` src=${q1}${fixed}${q2}`;
      });
    }

    if (
      /style=["'][^"']*position:\s*absolute/i.test(a) ||
      /style=["'][^"']*width:\s*100%[^"']*height:\s*100%/i.test(a)
    ) {
      a = a.replace(
        /style=["'][^"']*["']/i,
        'style="max-width:100%;height:auto;display:block;margin-left:auto;margin-right:auto"'
      );
    }

    return `<img${a}>`;
  });

  return out;
}

/**
 * Wix Pro Gallery SSR hides most slides (`display:none`) and relies on JS. Replace each gallery
 * (+ sibling layout-fixer block) with a simple responsive grid of images parsed from the markup.
 */
function flattenWixProGalleries(html: string): string {
  const openRe = /<div id="pro-gallery-[a-z0-9]+-not-scoped" class="pro-gallery">/gi;
  let out = html;
  let guard = 0;
  while (guard++ < 50) {
    openRe.lastIndex = 0;
    const m = openRe.exec(out);
    if (!m) break;
    const start = m.index;
    const endGallery = findClosingDivIndex(out, start);
    if (endGallery === -1) break;
    let end = endGallery;
    const after = out.slice(end);
    if (after.startsWith('<div id="layout-fixer-')) {
      const lfEnd = findClosingDivIndex(out, end);
      if (lfEnd !== -1) end = lfEnd;
    }
    const segment = out.slice(start, end);
    const urls = extractBestWixGalleryUrls(segment);
    const replacement =
      urls.length > 0
        ? `<div class="imported-wix-gallery-replacement" data-was-pro-gallery="true"><div class="imported-wix-gallery-grid">${urls
            .map(
              (u) =>
                `<figure class="imported-wix-image"><img src="${escapeHtmlAttr(upscaleWixFillUrl(u))}" alt="" loading="lazy" /></figure>`
            )
            .join('')}</div></div>`
        : '';
    out = out.slice(0, start) + replacement + out.slice(end);
  }
  return out;
}

function findClosingDivIndex(html: string, openTagStart: number): number {
  const openTagEnd = html.indexOf('>', openTagStart);
  if (openTagEnd === -1) return -1;
  let depth = 1;
  let i = openTagEnd + 1;
  while (i < html.length) {
    const closeIdx = html.indexOf('</div>', i);
    const openIdx = html.indexOf('<div', i);
    if (closeIdx === -1) return -1;
    const nextOpen = openIdx === -1 ? Infinity : openIdx;
    if (nextOpen < closeIdx) {
      depth++;
      i = nextOpen + 4;
    } else {
      depth--;
      if (depth === 0) return closeIdx + 6;
      i = closeIdx + 6;
    }
  }
  return -1;
}

function extractBestWixGalleryUrls(segment: string): string[] {
  const byId = new Map<string, { url: string; w: number }>();
  const consider = (raw: string) => {
    let url = raw.trim().replace(/^url\(['"]?|['"]?\)$/i, '');
    if (!url.includes('static.wixstatic.com')) return;
    const idm = url.match(/(a50b1d_[a-z0-9]+~mv2\.[a-z]+)/i);
    if (!idm) return;
    const id = idm[1];
    const wm = url.match(/\/v1\/fill\/w_(\d+),h_(\d+)/i);
    const w = wm ? parseInt(wm[1], 10) : 0;
    const prev = byId.get(id);
    if (!prev || w > prev.w) {
      byId.set(id, { url, w });
    }
  };
  let m: RegExpExecArray | null;
  const imgRe = /data-hook="gallery-item-image-img"[^>]*src="([^"]+)"/gi;
  while ((m = imgRe.exec(segment))) {
    consider(m[1]);
  }
  const bgRe = /background-image:url\(([^)]+)\)/gi;
  while ((m = bgRe.exec(segment))) {
    consider(m[1]);
  }
  return Array.from(byId.values())
    .sort((a, b) => b.w - a.w)
    .map((x) => x.url);
}

function escapeHtmlAttr(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

function fixWixImageUrl(url: string): string {
  let u = url.replace(/,blur_2/g, '').replace(/blur_2,/g, '');
  return upscaleWixFillUrl(u);
}

/** Bump small /v1/fill/w_X,h_Y/ segments to a sharper size (Wix CDN accepts this). */
function upscaleWixFillUrl(url: string): string {
  return url.replace(/\/v1\/fill\/w_(\d+),h_(\d+)/i, (_m, wStr, hStr) => {
    const w = parseInt(wStr, 10);
    const h = parseInt(hStr, 10);
    if (!w || !h || w >= 1920) {
      return `/v1/fill/w_${wStr},h_${hStr}`;
    }
    const targetW = 1920;
    const targetH = Math.max(1, Math.round((h / w) * targetW));
    return `/v1/fill/w_${targetW},h_${targetH}`;
  });
}
