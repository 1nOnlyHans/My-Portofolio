import { isVideo, mediaItem, slugify } from "./content";

export const formatDate = (d) =>
  new Date(d).toLocaleDateString("en", { month: "long", year: "numeric" });

// YouTube / Vimeo watch links become embed urls; anything else plays in <video>
export function embedUrl(url) {
  const yt = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/.exec(url);
  if (yt) return `https://www.youtube-nocookie.com/embed/${yt[1]}`;
  const vm = /vimeo\.com\/(\d+)/.exec(url);
  return vm ? `https://player.vimeo.com/video/${vm[1]}` : null;
}

// Fills in what the admin editor doesn't store (type, id, slug) and keeps only
// projects that can render: published, with media and a cover. Newest first.
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
        coverImage: p.coverImage || media.find((m) => m.type === "image")?.url,
      };
    })
    .filter((p) => p.published && p.media.length && p.coverImage)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
