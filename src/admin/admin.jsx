import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUp, Image as ImageIcon, Plus, Trash2, Upload, X } from "lucide-react";
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

// shrink before upload: keeps bodies under Vercel's 4.5MB function limit and pages fast
async function resize(file) {
  const bmp = await createImageBitmap(file);
  const scale = Math.min(1, 1600 / Math.max(bmp.width, bmp.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bmp.width * scale);
  canvas.height = Math.round(bmp.height * scale);
  canvas.getContext("2d").drawImage(bmp, 0, 0, canvas.width, canvas.height);
  return new Promise((done) => canvas.toBlob(done, "image/webp", 0.85));
}

async function uploadImage(file) {
  const name = file.name.replace(/\.[^.]+$/, "") + ".webp";
  const res = await fetch(`/api/upload?name=${encodeURIComponent(name)}`, {
    method: "POST",
    headers: { "Content-Type": "application/octet-stream" },
    body: await resize(file),
  });
  if (!res.ok) {
    const { error } = await res.json().catch(() => ({}));
    throw new Error(res.status === 401 ? "Session expired" : error || `Upload failed (${res.status})`);
  }
  return (await res.json()).url;
}

function UploadButton({ onUploaded, multiple }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const pick = async (e) => {
    const files = [...e.target.files];
    e.target.value = "";
    setBusy(true);
    setError("");
    try {
      onUploaded(await Promise.all(files.map(uploadImage)));
    } catch (err) {
      setError(err.message);
    }
    setBusy(false);
  };
  return (
    <span className="inline-flex items-center gap-3">
      <label className={`${btn} cursor-pointer`}>
        <Upload size={14} className="mr-1 inline" />
        {busy ? "Uploading…" : "Upload"}
        <input type="file" accept="image/*" multiple={multiple} hidden disabled={busy} onChange={pick} />
      </label>
      {error && <span role="alert" className="text-sm text-red-500">{error}</span>}
    </span>
  );
}

// pick from images already uploaded (Media tab); multiple = tick several, then confirm
function MediaPicker({ onPick, multiple }) {
  const ref = useRef(null);
  const [files, setFiles] = useState(null);
  const [chosen, setChosen] = useState([]);

  const open = () => {
    setChosen([]);
    setFiles(null);
    ref.current.showModal();
    fetch("/api/upload")
      .then((r) => (r.ok ? r.json() : []))
      .then(setFiles);
  };
  const done = (urls) => {
    ref.current.close();
    onPick(urls);
  };
  const click = (url) =>
    multiple
      ? setChosen((c) => (c.includes(url) ? c.filter((u) => u !== url) : [...c, url]))
      : done([url]);

  return (
    <>
      <button type="button" className={btn} onClick={open}>
        <ImageIcon size={14} className="mr-1 inline" /> Choose from Media
      </button>
      <dialog
        ref={ref}
        onClick={(e) => e.target === ref.current && ref.current.close()}
        className="m-auto w-[min(48rem,94vw)] border border-border bg-background p-4 text-foreground backdrop:bg-black/60"
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm">Choose from Media</h3>
          <button type="button" className={btn} onClick={() => ref.current.close()} aria-label="Close">
            <X size={14} />
          </button>
        </div>
        {!files && <p className="text-sm">Loading…</p>}
        {files && !files.length && (
          <p className="text-sm text-muted-foreground">No uploaded images yet. Use Upload first.</p>
        )}
        <div className="grid max-h-[60vh] grid-cols-3 gap-3 overflow-y-auto sm:grid-cols-4">
          {files?.map((f) => (
            <button
              key={f.url}
              type="button"
              onClick={() => click(f.url)}
              aria-pressed={chosen.includes(f.url)}
              className={`border p-1 ${chosen.includes(f.url) ? "border-accent ring-2 ring-accent" : "border-border hover:border-accent"}`}
            >
              <img src={f.url} alt="" className="aspect-[3/4] w-full object-cover" />
            </button>
          ))}
        </div>
        {multiple && (
          <div className="mt-4">
            <button type="button" className={btn} disabled={!chosen.length} onClick={() => done(chosen)}>
              Add {chosen.length || ""} selected
            </button>
          </div>
        )}
      </dialog>
    </>
  );
}

function ImageField({ label, value, onChange }) {
  return (
    <div className="space-y-2">
      <span className="text-xs uppercase tracking-widest text-muted-foreground" style={mono}>{label}</span>
      <div className="flex flex-wrap items-center gap-4">
        {value ? (
          <img src={value} alt="" className="h-24 w-20 border border-border object-cover" />
        ) : (
          <span className="text-sm text-muted-foreground">Using bundled image</span>
        )}
        <UploadButton onUploaded={([url]) => onChange(url)} />
        <MediaPicker onPick={([url]) => onChange(url)} />
        {value && <button type="button" className={btn} onClick={() => onChange("")}>Use default</button>}
      </div>
    </div>
  );
}

function PhotoList({ value, onChange }) {
  return (
    <div className="space-y-2">
      <span className="text-xs uppercase tracking-widest text-muted-foreground" style={mono}>
        About photos (none = bundled photos)
      </span>
      <div className="flex flex-wrap gap-3">
        {value.map((url, i) => (
          <div key={url} className="relative">
            <img src={url} alt="" className="h-28 w-24 border border-border object-cover" />
            <button
              type="button"
              aria-label="Remove photo"
              className="absolute right-1 top-1 border border-border bg-background/90 p-1"
              onClick={() => onChange(value.filter((_, j) => j !== i))}
            >
              <Trash2 size={12} />
            </button>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <UploadButton multiple onUploaded={(urls) => onChange([...value, ...urls])} />
        <MediaPicker
          multiple
          onPick={(urls) => onChange([...value, ...urls.filter((u) => !value.includes(u))])}
        />
      </div>
    </div>
  );
}

function Media() {
  const [files, setFiles] = useState(null);
  const refresh = () =>
    fetch("/api/upload")
      .then((r) => (r.ok ? r.json() : []))
      .then(setFiles);
  useEffect(() => {
    refresh();
  }, []);

  const remove = async (url) => {
    if (!window.confirm("Delete this image? Any section using it will show a broken image until you change it.")) return;
    await api(`/api/upload?url=${encodeURIComponent(url)}`, "DELETE");
    refresh();
  };

  if (!files) return <p className="text-sm">Loading…</p>;
  return (
    <div className="space-y-4">
      <UploadButton multiple onUploaded={refresh} />
      {!files.length && <p className="text-sm text-muted-foreground">No uploaded images yet.</p>}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {files.map((f) => (
          <div key={f.url} className="space-y-2 border border-border p-2">
            <img src={f.url} alt="" className="aspect-[3/4] w-full object-cover" />
            <div className="flex items-center justify-between text-xs text-muted-foreground" style={mono}>
              <span>{Math.round(f.size / 1024)} KB</span>
              <button type="button" className={btn} onClick={() => remove(f.url)} aria-label="Delete image">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

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
      <h3 className="pt-2 text-sm">Images</h3>
      <ImageField label="Hero portrait (light theme)" value={d.heroLight} onChange={(v) => set({ ...d, heroLight: v })} />
      <ImageField label="Hero portrait (dark theme)" value={d.heroDark} onChange={(v) => set({ ...d, heroDark: v })} />
      <PhotoList value={d.photos ?? []} onChange={(photos) => set({ ...d, photos })} />
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

  commands: (d, set) => (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Hero terminal commands. Built in and always available: help, echo, date, clear. Names may have spaces
        (e.g. "ls skills"). Set "Scroll to" to jump to a section instead of printing output.
      </p>
      <List
        items={d}
        onChange={set}
        blank={{ name: "", output: "" }}
        render={(c, up) => (
          <>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Command" value={c.name} onChange={(v) => up({ name: v.trim().toLowerCase() })} />
              <Field label="Scroll to section id (optional)" value={c.scrollTo} onChange={(v) => up({ scrollTo: v.trim() })} />
            </div>
            <Field label="Output" rows={2} value={c.output} onChange={(v) => up({ output: v })} />
          </>
        )}
      />
    </div>
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
        {[...Object.keys(editors), "media"].map((k) => (
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

      {tab === "media" ? (
        <Media />
      ) : (
        <>
          {editors[tab](data[tab], (v) => setData({ ...data, [tab]: v }))}
          <div className="sticky bottom-0 flex items-center gap-4 border-t border-border bg-background py-4">
            <button className={btn} onClick={save}>Save {tab}</button>
            <span className="text-sm text-muted-foreground" role="status">{status}</span>
          </div>
        </>
      )}
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
