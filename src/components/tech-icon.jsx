import { Code, Gamepad2, Webhook } from "lucide-react";
import {
  SiAngular, SiBootstrap, SiC, SiCplusplus, SiCss, SiDocker, SiDotnet, SiExpress, SiFigma,
  SiFirebase, SiFlutter, SiGit, SiGithub, SiGraphql, SiHtml5, SiInertia, SiJavascript,
  SiJquery, SiKotlin, SiLaravel, SiLinux, SiLivewire, SiMongodb, SiMysql, SiNextdotjs,
  SiNginx, SiNodedotjs, SiPhp, SiPostgresql, SiPostman, SiPrisma, SiPython, SiReact,
  SiRedis, SiSass, SiSqlite, SiSupabase, SiSvelte, SiTailwindcss, SiTypescript, SiVercel,
  SiVite, SiVuedotjs, SiWordpress,
} from "react-icons/si";

// keyed by name with everything but a-z0-9 stripped: "Vue.js", "VueJS" and "vue js" all hit "vuejs"
const icons = {
  react: SiReact, reactjs: SiReact, vue: SiVuedotjs, vuejs: SiVuedotjs, angular: SiAngular,
  svelte: SiSvelte, nextjs: SiNextdotjs, vite: SiVite, html: SiHtml5, html5: SiHtml5,
  css: SiCss, css3: SiCss, sass: SiSass, scss: SiSass, tailwind: SiTailwindcss,
  tailwindcss: SiTailwindcss, bootstrap: SiBootstrap, javascript: SiJavascript, js: SiJavascript,
  typescript: SiTypescript, ts: SiTypescript, jquery: SiJquery, nodejs: SiNodedotjs,
  node: SiNodedotjs, express: SiExpress, php: SiPhp, laravel: SiLaravel, livewire: SiLivewire,
  inertia: SiInertia, inertiajs: SiInertia, wordpress: SiWordpress, python: SiPython,
  c: SiC, cpp: SiCplusplus, dotnet: SiDotnet, kotlin: SiKotlin, flutter: SiFlutter,
  mysql: SiMysql, postgresql: SiPostgresql, postgres: SiPostgresql, sqlite: SiSqlite,
  mongodb: SiMongodb, redis: SiRedis, firebase: SiFirebase, supabase: SiSupabase,
  prisma: SiPrisma, graphql: SiGraphql, git: SiGit, github: SiGithub, docker: SiDocker,
  linux: SiLinux, nginx: SiNginx, vercel: SiVercel, figma: SiFigma, postman: SiPostman,
  restfulapis: Webhook, restfulapi: Webhook, restapi: Webhook, restapis: Webhook, api: Webhook,
  pygame: Gamepad2,
};

export default function TechIcon({ name, className, size = 16 }) {
  const Icon = icons[name.toLowerCase().replace(/[^a-z0-9]/g, "")] ?? Code;
  return <Icon size={size} className={className} aria-hidden="true" />;
}
