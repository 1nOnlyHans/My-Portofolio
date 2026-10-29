// Creative works shown in the "Beyond the Code" section. Edit here to add a project.
// shape: { id, slug, title, description, category, coverImage, media: [{ type, url, thumbnail? }],
//          tools: [], createdAt: "YYYY-MM-DD", featured, externalUrl?, published }
// - category: any string; the filter tabs are built from the categories present ("Others" sorts last)
// - media video url: .mp4/.webm, or a YouTube/Vimeo watch link (embedded on demand)
// - published: false hides it everywhere
// Files in /public/creative/ are served at /creative/<name>.
//
// The entries below are PLACEHOLDERS for layout testing. Delete them and add real work.
const creative = [
  {
    id: "placeholder-brand",
    slug: "placeholder-brand-identity",
    title: "[Placeholder] Brand Identity Concept",
    description:
      "Placeholder entry for testing the featured layout. Replace with a real logo or brand identity project.",
    category: "Branding & Identity",
    coverImage: "/creative/placeholder-brand.svg",
    media: [
      { type: "image", url: "/creative/placeholder-brand.svg" },
      { type: "image", url: "/creative/placeholder-poster.svg" },
    ],
    tools: ["Illustrator", "Figma"],
    createdAt: "2026-09-01",
    featured: true,
    published: true,
  },
  {
    id: "placeholder-poster",
    slug: "placeholder-poster-design",
    title: "[Placeholder] Poster Design",
    description: "Placeholder entry for a graphic design project with an image gallery and lightbox.",
    category: "Graphic Design",
    coverImage: "/creative/placeholder-poster.svg",
    media: [
      { type: "image", url: "/creative/placeholder-poster.svg" },
      { type: "image", url: "/creative/placeholder-edit.svg" },
      { type: "image", url: "/creative/placeholder-ai-video.svg" },
    ],
    tools: ["Photoshop", "Canva"],
    createdAt: "2026-08-12",
    featured: false,
    published: true,
  },
  {
    id: "placeholder-ai-video",
    slug: "placeholder-ai-video",
    title: "[Placeholder] AI Product Promo",
    description: "Placeholder entry for an AI-generated video. Uses a public sample clip until real work is added.",
    category: "AI Videos",
    coverImage: "/creative/placeholder-ai-video.svg",
    media: [
      {
        type: "video",
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        thumbnail: "/creative/placeholder-ai-video.svg",
      },
    ],
    tools: ["Runway", "CapCut"],
    createdAt: "2026-07-20",
    featured: false,
    externalUrl: "https://example.com",
    published: true,
  },
  {
    id: "placeholder-edit",
    slug: "placeholder-video-edit",
    title: "[Placeholder] Short-form Reel",
    description: "Placeholder entry for an edited reel, embedded from YouTube.",
    category: "Video Editing",
    coverImage: "/creative/placeholder-edit.svg",
    media: [
      {
        type: "video",
        url: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
        thumbnail: "/creative/placeholder-edit.svg",
      },
    ],
    tools: ["After Effects", "CapCut"],
    createdAt: "2026-06-05",
    featured: false,
    published: true,
  },
];

export default creative;
