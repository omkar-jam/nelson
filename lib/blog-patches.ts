import 'server-only';

/**
 * Client QA fixes for specific migrated Wix posts (videos, layout, duplicate blocks).
 * Runs after {@link fixImportedWixBlogHtml} in `getPostBySlug`.
 */
export function applyBlogClientPatches(slug: string, html: string): string {
  if (!html) return html;
  let out = html;

  if (slug === 'platigleam-in-angkor-wat-my-journey-through-light-and-shadow') {
    out = out.replace(
      /<div type="video" data-hook="rcv-block7"><\/div>/i,
      youtubeEmbed('XUmEXHVHhcY')
    );
  }

  if (slug === 'platigleam-at-borobudur-temple-a-historic-first') {
    out = patchBorobudurMediaParagraph(out);
  }

  if (slug === 'un-veilings-of-pedro-and-inês-honoring-700-years-of-inês-de-castro') {
    out = patchUnveilingsPost(out);
  }

  if (slug === 'a-minha-pintura-na-coleção-d-a-brasileira-uma-homenagem-a-pessoa-e-ao-fragmento') {
    out = out.replace(
      /src="https:\/\/www\.youtube\.com\/embed\/5MpIqeXMBOA(?:\?[^"]*)?"/i,
      'src="https://www.youtube.com/embed/5MpIqeXMBOA"'
    );
  }

  if (slug === 'laying-open-hidden-layers-of-art-history-my-podcast-interview-experience') {
    out = patchPodcastPost(out);
  }

  return out;
}

function youtubeEmbed(videoId: string, startSeconds?: number): string {
  const q = startSeconds != null && startSeconds > 0 ? `?start=${startSeconds}` : '';
  return `<div class="my-8 aspect-video w-full max-w-3xl overflow-hidden rounded-sm border border-plati-border"><iframe class="h-full w-full" width="560" height="315" src="https://www.youtube.com/embed/${videoId}${q}" title="YouTube video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen loading="lazy"></iframe></div>`;
}

function patchBorobudurMediaParagraph(html: string): string {
  const pRe =
    /<p class="dEt5S sjVPj J7otF nEzPS" dir="auto" id="viewer-sqfqk17363">([\s\S]*?)<\/p>/i;
  const m = html.match(pRe);
  if (!m) return html;
  const inner = m[1];
  const needle = 'those articles too:</span>';
  const n = inner.indexOf(needle);
  if (n === -1) return html;
  const introClosed = `${inner.slice(0, n + needle.length)}</span>`;
  let rest = inner.slice(n + needle.length);
  const firstLink = rest.search(/<a\s+[^>]*target="_blank"/i);
  if (firstLink === -1) return html;
  rest = rest.slice(firstLink);
  const tagStart = rest.indexOf('<a class="UQEEo"');
  if (tagStart === -1) return html;
  let linksChunk = rest.slice(0, tagStart).replace(/<span>\s*<\/span>/gi, '');
  let hashtagsChunk = rest
    .slice(tagStart)
    .replace(/<br\s+role="presentation"\s*\/?>/gi, '')
    .replace(/(?:<span>\s*<\/span>\s*)+$/i, '');
  hashtagsChunk = `<span class="Q-E3F">${hashtagsChunk}</span>`;

  const replacement = `<p class="dEt5S sjVPj J7otF nEzPS" dir="auto" id="viewer-sqfqk17363">${introClosed}</p><div class="imported-borobudur-media-line" aria-label="Press links">${linksChunk}</div><p class="imported-borobudur-hashtags dEt5S sjVPj J7otF nEzPS" dir="auto">${hashtagsChunk}</p>`;
  return html.replace(pRe, replacement);
}

function patchUnveilingsPost(html: string): string {
  let out = html;
  /* Remove duplicate empty figure block (caption only, same text as main image alt) */
  out = out.replace(
    /<div data-hook="gap-spacer" class="LWFb0 D39St"><\/div><div class="v6guB" id="viewer-ggzjq233"><div class="aEuvx"><figcaption class="hfXQ8" style="padding-top:16px;padding-bottom:16px"><span>Some of the icons I painted in the Byzantine style\.<\/span><\/figcaption><\/div><\/div><div data-hook="gap-spacer" class="LWFb0 D39St"><\/div><\/figure>/i,
    '</figure>'
  );
  /* Hero / header screenshot (was present on live Wix as pin media) */
  const hero =
    '<div class="imported-blog-hero imported-wix-image"><img src="https://static.wixstatic.com/media/a50b1d_fc10a11cf86c42ccbc3c28ec8980dfda~mv2.png/v1/fill/w_1920,h_480,al_c,q_90,enc_auto/a50b1d_fc10a11cf86c42ccbc3c28ec8980dfda~mv2.png" alt="(Un)VEILINGS OF PEDRO AND INÊS" loading="lazy" /></div>';
  const rootOpen = out.indexOf('class="wnwZD imported-ricos-root"');
  if (rootOpen !== -1) {
    const gt = out.indexOf('>', rootOpen);
    if (gt !== -1) {
      out = out.slice(0, gt + 1) + hero + out.slice(gt + 1);
    }
  }
  out = out.replace(
    /src="https:\/\/www\.youtube\.com\/embed\/JajTqjm-mvc(?:\?[^"]*)?"/gi,
    'src="https://www.youtube.com/embed/JajTqjm-mvc?start=1"'
  );
  return out;
}

function patchPodcastPost(html: string): string {
  return html.replace(
    /<iframe class="uAQof"[\s\S]*?src="(https:\/\/consideringart\.com[^"]+)"[\s\S]*?><\/iframe>/i,
    '<div class="imported-podcast-page-embed"><iframe class="uAQof imported-podcast-page-iframe" title="remote content" data-hook="iframe-component" style="background-color:transparent;width:100%;min-height:min(920px,85vh);border:0" allow="fullscreen; autoplay; encrypted-media" allowfullscreen="" tabindex="0" src="$1" sandbox="allow-popups allow-presentation allow-forms allow-same-origin allow-scripts"></iframe></div>'
  );
}
