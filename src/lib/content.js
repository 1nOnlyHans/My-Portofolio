import { useEffect, useState } from "react";
import profile from "@/data/profile";
import projects from "@/data/projects";
import skills from "@/data/skills";
import commands from "@/data/commands";

// bundled content doubles as fallback when the API/DB is down or a block was never saved
export const defaults = { profile, projects, skills, commands };

let request;
export const fetchContent = (fresh) => {
  const load = () =>
    fetch(`/api/content${fresh ? "?fresh=1" : ""}`)
      .then((r) => (r.ok ? r.json() : {}))
      .catch(() => ({}));
  return fresh ? load() : (request ??= load());
};

export function useContent(key) {
  const [db, setDb] = useState({});
  useEffect(() => {
    fetchContent().then(setDb);
  }, []);
  return db[key] ?? defaults[key];
}
