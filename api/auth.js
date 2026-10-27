import { createHash, timingSafeEqual } from "node:crypto";
import { isAdmin, signSession } from "./_lib.js";

const sha = (s) => createHash("sha256").update(String(s)).digest();
const cookie = (value, maxAge) =>
  `session=${value}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${maxAge}`;

export default async function handler(req, res) {
  if (req.method === "GET") return res.json({ admin: await isAdmin(req) });

  if (req.method === "POST") {
    const ok =
      process.env.ADMIN_PASSWORD &&
      timingSafeEqual(sha(req.body?.password ?? ""), sha(process.env.ADMIN_PASSWORD));
    if (!ok) return res.status(401).json({ error: "wrong password" });
    res.setHeader("Set-Cookie", cookie(await signSession(), 60 * 60 * 24 * 7));
    return res.json({ admin: true });
  }

  if (req.method === "DELETE") {
    res.setHeader("Set-Cookie", cookie("", 0));
    return res.json({ admin: false });
  }

  res.status(405).end();
}
