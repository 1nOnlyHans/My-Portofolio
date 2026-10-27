import { put, del, list } from "@vercel/blob";
import { isAdmin } from "./_lib.js";

const PREFIX = "portfolio/";
const TYPES = ["image/webp", "image/jpeg", "image/png"];

export default async function handler(req, res) {
  if (!(await isAdmin(req))) return res.status(401).json({ error: "unauthorized" });

  if (req.method === "GET") {
    const { blobs } = await list({ prefix: PREFIX });
    return res.json(blobs.map(({ url, pathname, size, uploadedAt }) => ({ url, pathname, size, uploadedAt })));
  }

  if (req.method === "POST") {
    // client resizes to <=1600px webp first, so bodies stay under Vercel's 4.5MB function limit
    const type = req.query.type ?? "image/webp";
    if (!TYPES.includes(type) || !Buffer.isBuffer(req.body) || !req.body.length) {
      return res.status(400).json({ error: "bad request" });
    }
    const name = String(req.query.name ?? "image.webp").replace(/[^\w.-]/g, "_");
    const blob = await put(PREFIX + name, req.body, {
      access: "public",
      addRandomSuffix: true,
      contentType: type,
    });
    return res.json({ url: blob.url });
  }

  if (req.method === "DELETE") {
    const url = String(req.query.url ?? "");
    // only allow deleting files this endpoint created
    if (!/^https:\/\/[\w-]+\.public\.blob\.vercel-storage\.com\/portfolio\//.test(url)) {
      return res.status(400).json({ error: "bad url" });
    }
    await del(url);
    return res.json({ ok: true });
  }

  res.status(405).end();
}
