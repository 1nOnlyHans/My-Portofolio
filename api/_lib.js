import { neon } from "@neondatabase/serverless";
import { SignJWT, jwtVerify } from "jose";

export const sql = neon(process.env.DATABASE_URL);

const secret = () => new TextEncoder().encode(process.env.JWT_SECRET);

// one jsonb document per content block: profile, projects, skills
let ready;
export const init = () =>
  (ready ??= sql`create table if not exists content (key text primary key, data jsonb not null)`);

export const signSession = () =>
  new SignJWT({}).setProtectedHeader({ alg: "HS256" }).setExpirationTime("7d").sign(secret());

export async function isAdmin(req) {
  const token = /(?:^|; )session=([^;]+)/.exec(req.headers.cookie || "")?.[1];
  if (!token) return false;
  try {
    await jwtVerify(token, secret());
    return true;
  } catch {
    return false;
  }
}
