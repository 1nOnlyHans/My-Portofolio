import { sql, init, isAdmin } from "./_lib.js";

const KEYS = ["profile", "projects", "skills", "commands", "certifications"];

export default async function handler(req, res) {
  await init();

  if (req.method === "GET") {
    const rows = await sql`select key, data from content`;
    // admin passes ?fresh=1 so edits show up immediately
    res.setHeader(
      "Cache-Control",
      req.query.fresh ? "no-store" : "s-maxage=60, stale-while-revalidate=300",
    );
    return res.json(Object.fromEntries(rows.map((r) => [r.key, r.data])));
  }

  if (req.method === "PUT") {
    if (!(await isAdmin(req))) return res.status(401).json({ error: "unauthorized" });
    const { key, data } = req.body ?? {};
    if (!KEYS.includes(key) || data == null) return res.status(400).json({ error: "bad request" });
    await sql`insert into content (key, data) values (${key}, ${JSON.stringify(data)}::jsonb)
      on conflict (key) do update set data = excluded.data`;
    return res.json({ ok: true });
  }

  res.status(405).end();
}
