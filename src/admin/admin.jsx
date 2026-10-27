import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { defaults, fetchContent } from "@/lib/content";

const box = "w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent";
const btn =
  "border border-border px-3 py-1.5 text-xs uppercase tracking-widest transition-colors hover:border-accent hover:text-accent disabled:opacity-50";
const mono = { fontFamily: "'DM Mono', monospace" };

const api = (url, method, body) =>
  fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body && JSON.stringify(body),
  });

function Field({ label, value, onChange, rows }) {
  const Tag = rows ? "textarea" : "input";
  return (
    <label className="block space-y-1">
      <span className="text-xs uppercase tracking-widest text-muted-foreground" style={mono}>
        {label}
      </span>
      <Tag className={box} rows={rows} value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

// comma list: commit on blur so typing "a, " isn't eaten mid-edit
function ListField({ label, value, onChange }) {
  const text = value.join(", ");
  return (
    <label className="block space-y-1" key={text}>
      <span className="text-xs uppercase tracking-widest text-muted-foreground" style={mono}>
        {label}
      </span>
      <input
        className={box}
        defaultValue={text}
        onBlur={(e) =>
          onChange(e.target.value.split(",").map((s) => s.trim()).filter(Boolean))
        }
      />
    </label>
  );
}

// ordered, editable array with add / remove / move
function List({ items, onChange, blank, render }) {
  const set = (i, patch) => onChange(items.map((it, j) => (j === i ? { ...it, ...patch } : it)));
  const move = (i, d) => {
    const next = [...items];
    [next[i], next[i + d]] = [next[i + d], next[i]];
    onChange(next);
  };
  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <div key={i} className="space-y-3 border border-border p-4">
          {render(item, (patch) => set(i, patch), i)}
          <div className="flex gap-2">
            <button type="button" className={btn} disabled={i === 0} onClick={() => move(i, -1)} aria-label="Move up">
              <ArrowUp size={14} />
            </button>
            <button type="button" className={btn} disabled={i === items.length - 1} onClick={() => move(i, 1)} aria-label="Move down">
              <ArrowDown size={14} />
            </button>
            <button type="button" className={btn} onClick={() => onChange(items.filter((_, j) => j !== i))} aria-label="Remove">
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      ))}
      <button type="button" className={btn} onClick={() => onChange([...items, blank])}>
        <Plus size={14} className="mr-1 inline" /> Add
      </button>
    </div>
  );
}

const editors = {
  profile: (d, set) => (
    <div className="space-y-4">
      <Field label="Tagline" value={d.tagline} onChange={(v) => set({ ...d, tagline: v })} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="First name" value={d.firstName} onChange={(v) => set({ ...d, firstName: v })} />
        <Field label="Last name" value={d.lastName} onChange={(v) => set({ ...d, lastName: v })} />
      </div>
      <Field label="Hero intro" rows={4} value={d.intro} onChange={(v) => set({ ...d, intro: v })} />
      <Field label="About lead" rows={4} value={d.aboutLead} onChange={(v) => set({ ...d, aboutLead: v })} />
      <Field label="About paragraph 1" rows={5} value={d.aboutLeft} onChange={(v) => set({ ...d, aboutLeft: v })} />
      <Field label="About paragraph 2" rows={5} value={d.aboutRight} onChange={(v) => set({ ...d, aboutRight: v })} />
      <h3 className="pt-2 text-sm">About facts</h3>
      <List
        items={d.facts}
        onChange={(facts) => set({ ...d, facts })}
        blank={{ label: "", value: "" }}
        render={(f, up) => (
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Label" value={f.label} onChange={(v) => up({ label: v })} />
            <Field label="Value" value={f.value} onChange={(v) => up({ value: v })} />
          </div>
        )}
      />
      <Field
        label="About photo URLs (one per line, empty = bundled photos)"
        rows={5}
        value={(d.photos ?? []).join("\n")}
        onChange={(v) => set({ ...d, photos: v.split("\n").map((s) => s.trim()).filter(Boolean) })}
      />
    </div>
  ),

  projects: (d, set) => (
    <List
      items={d}
      onChange={set}
      blank={{ title: "", year: new Date().getFullYear(), description: "", technologies: [], link: "#" }}
      render={(p, up) => (
        <>
          <div className="grid gap-3 sm:grid-cols-[1fr_8rem]">
            <Field label="Title" value={p.title} onChange={(v) => up({ title: v })} />
            <Field label="Year" value={p.year} onChange={(v) => up({ year: v })} />
          </div>
          <Field label="Description" rows={3} value={p.description} onChange={(v) => up({ description: v })} />
          <ListField label="Technologies (comma separated)" value={p.technologies} onChange={(v) => up({ technologies: v })} />
          <Field label="Link" value={p.link} onChange={(v) => up({ link: v })} />
        </>
      )}
    />
  ),

  skills: (d, set) => (
    <List
      items={d}
      onChange={set}
      blank={{ category: "", items: [] }}
      render={(c, up) => (
        <>
          <Field label="Category" value={c.category} onChange={(v) => up({ category: v })} />
          <List
            items={c.items}
            onChange={(items) => up({ items })}
            blank={{ name: "", level: 50 }}
            render={(s, upS) => (
              <div className="grid gap-3 sm:grid-cols-[1fr_8rem]">
                <Field label="Skill" value={s.name} onChange={(v) => upS({ name: v })} />
                <Field label="Level %" value={s.level} onChange={(v) => upS({ level: Math.min(100, Math.max(0, Number(v) || 0)) })} />
              </div>
            )}
          />
        </>
      )}
    />
  ),
};

function Login({ onDone }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const submit = async (e) => {
    e.preventDefault();
    const res = await api("/api/auth", "POST", { password });
    if (res.ok) onDone();
    else setError("Wrong password.");
  };
  return (
    <form onSubmit={submit} className="mx-auto mt-32 w-full max-w-sm space-y-4 px-4">
      <h1 className="text-2xl" style={{ fontFamily: "'Playfair Display', serif" }}>Admin</h1>
      <input
        type="password"
        autoFocus
        className={box}
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <p role="alert" className="text-sm text-red-500">{error}</p>}
      <button className={btn}>Log in</button>
    </form>
  );
}

function Dashboard({ onLogout }) {
  const [tab, setTab] = useState("profile");
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetchContent(true).then((db) => setData({ ...defaults, ...db }));
  }, []);

  if (!data) return <p className="p-8 text-sm">Loading…</p>;

  const save = async () => {
    setStatus("Saving…");
    const res = await api("/api/content", "PUT", { key: tab, data: data[tab] });
    if (res.status === 401) return onLogout();
    setStatus(res.ok ? "Saved. Live within a minute." : "Save failed.");
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-10">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl" style={{ fontFamily: "'Playfair Display', serif" }}>Admin</h1>
        <div className="flex gap-2">
          <a href="/" className={btn}>View site</a>
          <button
            className={btn}
            onClick={async () => {
              await api("/api/auth", "DELETE");
              onLogout();
            }}
          >
            Log out
          </button>
        </div>
      </header>

      <nav className="flex gap-2">
        {Object.keys(editors).map((k) => (
          <button
            key={k}
            className={`${btn} ${k === tab ? "border-accent text-accent" : ""}`}
            onClick={() => {
              setTab(k);
              setStatus("");
            }}
          >
            {k}
          </button>
        ))}
      </nav>

      {editors[tab](data[tab], (v) => setData({ ...data, [tab]: v }))}

      <div className="sticky bottom-0 flex items-center gap-4 border-t border-border bg-background py-4">
        <button className={btn} onClick={save}>Save {tab}</button>
        <span className="text-sm text-muted-foreground" role="status">{status}</span>
      </div>
    </div>
  );
}

export default function Admin() {
  const [admin, setAdmin] = useState(null);
  useEffect(() => {
    api("/api/auth", "GET")
      .then((r) => r.json())
      .then((j) => setAdmin(j.admin))
      .catch(() => setAdmin(false));
  }, []);

  if (admin === null) return null;
  return admin ? <Dashboard onLogout={() => setAdmin(false)} /> : <Login onDone={() => setAdmin(true)} />;
}
