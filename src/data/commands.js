// hero terminal commands. `scrollTo` (a section id) overrides `output`.
// `help`, `echo`, `date`, `clear` are built in.
const commands = [
  { name: "whoami", output: "Hans Diaz — Full-Stack Web Developer" },
  { name: "role", output: "Full-Stack Developer" },
  { name: "skills", output: "Web Development · UI/UX Design" },
  { name: "ls", output: "skills  projects  about  contact" },
  { name: "ls skills", output: "Web Development · UI/UX Design" },
  { name: "pwd", output: "/Cavite/Philippines" },
  { name: "about", scrollTo: "about" },
  { name: "projects", scrollTo: "projects" },
  { name: "contact", scrollTo: "contact" },
];

export default commands;
