import { isVideo, mediaItem, slugify } from "./content";

export const formatDate = (d) =>
  new Date(d).toLocaleDateString("en", { month: "long", year: "numeric" });

// YouTube / Vimeo watch links become embed urls; anything else plays in <video>
const ytId = (url) => /(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/.exec(url)?.[1];

export function embedUrl(url) {
  const yt = ytId(url);
  if (yt) return `https://www.youtube-nocookie.com/embed/${yt}`;
  const vm = /vimeo\.com\/(\d+)/.exec(url);
  return vm ? `https://player.vimeo.com/video/${vm[1]}` : null;
}

// still image for a media item: explicit thumbnail, the image itself, or a YouTube poster.
// Vimeo and self-hosted video have none without an upload (callers fall back).
export const thumbOf = (m) =>
  m.thumbnail ?? (m.type === "image" ? m.url : ytId(m.url) && `https://i.ytimg.com/vi/${ytId(m.url)}/hqdefault.jpg`);

// Fills in what the admin editor doesn't store (type, id, slug) and keeps only
// projects that can render: published and with media. Newest first.
export function publishedWorks(list) {
  return list
    .map((p, i) => {
      const media = [...(p.media ?? []).map(mediaItem), ...(p.videoLinks ?? []).map((url) => ({ url }))].map(
        (m) => ({ ...m, type: m.type ?? (isVideo(m.url) || embedUrl(m.url) ? "video" : "image") }),
      );
      return {
        ...p,
        id: p.id ?? `${slugify(p.title)}-${i}`,
        slug: p.slug ?? slugify(p.title),
        createdAt: p.createdAt ?? "",
        tools: p.tools ?? [],
        category: p.category || "Others",
        media,
        // may stay undefined (Vimeo-only / self-hosted video): the card has a fallback
        coverImage: p.coverImage || media.map(thumbOf).find(Boolean),
      };
    })
    .filter((p) => p.published && p.media.length)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
