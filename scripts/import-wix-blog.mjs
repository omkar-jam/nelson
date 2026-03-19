#!/usr/bin/env node
/**
 * Fetches all blog posts from nelson-ferreira.com via Wix blog-posts sitemap,
 * extracts SSR rich content (images + structure), converts embedded YouTube
 * previews to iframes, and writes prisma/data/imported-posts.json for seeding.
 *
 * Run: node scripts/import-wix-blog.mjs
 * Requires network. No extra npm dependencies (Node 18+).
 */

import { writeFile, mkdir } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUT = join(ROOT, 'prisma', 'data', 'imported-posts.json');
const SITEMAP = 'https://www.nelson-ferreira.com/blog-posts-sitemap.xml';

const UA =
  'Mozilla/5.0 (compatible; NelsonSiteImporter/1.0; +https://www.nelson-ferreira.com)';

async function fetchText(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'text/html,application/xml' } });
  if (!res.ok) throw new Error(`GET ${url} -> ${res.status}`);
  return res.text();
}

function parseSitemapPostUrls(xml) {
  const urls = [];
  const re = /<loc>\s*(https:\/\/www\.nelson-ferreira\.com\/post\/[^<]+)\s*<\/loc>/gi;
  let m;
  while ((m = re.exec(xml)) !== null) {
    urls.push(m[1].trim());
  }
  return [...new Set(urls)];
}

function metaContent(html, property) {
  const re = new RegExp(
    `<meta[^>]+property=["']${property.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["'][^>]+content=["']([^"']*)["']`,
    'i'
  );
  const m = html.match(re);
  return m ? m[1].trim() : '';
}

/** Extract inner HTML of the outer <section data-hook="post-description"> */
function extractPostDescriptionHtml(html) {
  const hookIdx = html.indexOf('data-hook="post-description"');
  if (hookIdx === -1) return null;
  const start = html.lastIndexOf('<section', hookIdx);
  if (start === -1) return null;
  const footerIdx = html.indexOf('data-hook="post-footer"', hookIdx);
  if (footerIdx === -1) return null;

  let depth = 0;
  for (let p = start; p < footerIdx; p++) {
    if (html.slice(p, p + 8).toLowerCase() === '<section') {
      depth++;
      p += 7;
    } else if (html.slice(p, p + 10).toLowerCase() === '</section>') {
      depth--;
      if (depth === 0) {
        return html.slice(start, p + 10);
      }
      p += 9;
    }
  }
  return null;
}

/** YouTube id from i.ytimg.com/vi/ID/ or youtu.be/ID or watch?v= */
function extractYoutubeId(fragment) {
  let m = fragment.match(/i\.ytimg\.com\/vi\/([a-zA-Z0-9_-]{6,})/);
  if (m) return m[1];
  m = fragment.match(/youtu\.be\/([a-zA-Z0-9_-]{6,})/);
  if (m) return m[1].split('?')[0];
  m = fragment.match(/[?&]v=([a-zA-Z0-9_-]{6,})/);
  if (m) return m[1].split('&')[0];
  return null;
}

function youtubeIframe(id) {
  return `<div class="my-8 aspect-video w-full max-w-3xl overflow-hidden rounded-sm border border-plati-border"><iframe class="h-full w-full" width="560" height="315" src="https://www.youtube.com/embed/${id}" title="YouTube video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen loading="lazy"></iframe></div>`;
}

/**
 * Replace Wix Ricos VIDEO figures (preview buttons) with YouTube embeds.
 * Falls back to <video> for wixstatic mp4 previews if present.
 */
function transformVideos(html) {
  let out = html;
  const figRe = /<figure[^>]*data-hook="figure-VIDEO"[^>]*>[\s\S]*?<\/figure>/gi;
  out = out.replace(figRe, (fig) => {
    const id = extractYoutubeId(fig);
    if (id) return youtubeIframe(id);
    const mp4 = fig.match(/https:\/\/video\.wixstatic\.com\/[^"'\\s]+\.mp4/);
    if (mp4) {
      return `<div class="my-8 w-full max-w-3xl"><video class="w-full rounded-sm border border-plati-border" controls playsinline preload="metadata" src="${mp4[0]}"></video></div>`;
    }
    return fig;
  });
  return out;
}

function stripLeadingTitleFromBody(bodyHtml, title) {
  if (!title || !bodyHtml) return bodyHtml;
  const t = title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const h2 = new RegExp(
    `<h2[^>]*>\\s*<span[^>]*>\\s*<span[^>]*>\\s*${t}\\s*<\\/span>[\\s\\S]*?<\\/h2>`,
    'i'
  );
  return bodyHtml.replace(h2, '').trim();
}

function textExcerpt(html, max = 320) {
  const plain = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (plain.length <= max) return plain;
  return `${plain.slice(0, max - 1)}…`;
}

function slugFromPostUrl(url) {
  const u = new URL(url);
  return decodeURIComponent(u.pathname.replace(/^\/post\//, '').replace(/\/$/, ''));
}

async function importPost(url) {
  const html = await fetchText(url);
  const section = extractPostDescriptionHtml(html);
  if (!section) {
    throw new Error('Could not find post-description section (layout changed?)');
  }

  let body = transformVideos(section);
  const title =
    metaContent(html, 'og:title') ||
    metaContent(html, 'twitter:title') ||
    slugFromPostUrl(url);
  body = stripLeadingTitleFromBody(body, title);

  const ogDesc = metaContent(html, 'og:description');
  const excerpt = ogDesc || textExcerpt(body);

  const publishedRaw = metaContent(html, 'article:published_time');
  const publishedAt = publishedRaw ? new Date(publishedRaw).toISOString() : new Date().toISOString();

  return {
    title,
    slug: slugFromPostUrl(url),
    excerpt,
    body,
    publishedAt,
    sourceUrl: url,
  };
}

async function main() {
  console.log('Fetching sitemap:', SITEMAP);
  const xml = await fetchText(SITEMAP);
  const urls = parseSitemapPostUrls(xml);
  console.log('Found', urls.length, 'post URLs');

  const posts = [];
  const errors = [];

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    const slug = slugFromPostUrl(url);
    process.stdout.write(`[${i + 1}/${urls.length}] ${slug} … `);
    try {
      const post = await importPost(url);
      posts.push(post);
      console.log('ok');
    } catch (e) {
      console.log('FAIL', e.message);
      errors.push({ url, error: String(e.message || e) });
    }
    await new Promise((r) => setTimeout(r, 400));
  }

  posts.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

  await mkdir(dirname(OUT), { recursive: true });
  await writeFile(OUT, JSON.stringify({ importedAt: new Date().toISOString(), posts, errors }, null, 2), 'utf8');

  console.log('\nWrote', OUT);
  console.log('Imported:', posts.length, 'Failed:', errors.length);
  if (errors.length) {
    console.warn('Errors:', errors);
    process.exitCode = 1;
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
