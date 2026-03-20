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
