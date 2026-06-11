import hansPhoto from "../assets/images/hans.jpg";
import ScrollReveal from "../components/ui/scroll-reveal";

export default function About() {
  return (
    <section id="about" className="portfolio-section">
      <div className="grid w-full gap-10 md:grid-cols-2 md:items-center lg:gap-16">
        <ScrollReveal className="max-w-3xl space-y-6" direction="right">
          <span className="block text-sm text-mono uppercase text-muted-foreground font-light tracking-widest">
            01 / About
          </span>
          <h2
            className="mb-6"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2rem, 3.5vw, 2.8rem)",
              fontWeight: 400,
              lineHeight: 1.2,
              letterSpacing: "-0.01em",
              color: "var(--foreground)",
            }}
          >
            Code is my medium, the web is my canvas
          </h2>
          <div
            className="space-y-5 text-muted-foreground"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 300,
              lineHeight: 1.8,
              fontSize: "1rem",
            }}
          >
            <p>
              I'm a fourth-year IT student based in Cavite with a strong passion
              for full-stack web development. I enjoy turning ideas into
              functional and user-friendly applications, from responsive
              front-end interfaces to scalable back-end systems.
            </p>
            <p>
              Throughout my academic journey and personal projects, I've gained
              hands-on experience working with technologies such as Laravel,
              Vue.js, React and modern web development tools. I value writing
              clean, maintainable code and continuously seek opportunities to
              improve my technical skills and understanding of software
              architecture.
            </p>
            <p>
              Beyond coding, I enjoy exploring new technologies, contributing to
              collaborative projects, and expanding my knowledge through
              continuous learning. I'm eager to grow as a developer and
              contribute to building meaningful digital experiences that solve
              real-world problems.
            </p>
          </div>
        </ScrollReveal>
        <ScrollReveal
          className="flex justify-center"
          direction="left"
          delay={0.15}
        >
          <img
            src={hansPhoto}
            alt="Hans Diaz"
            className="w-120 h-120 rounded object-cover border-4 border-secondary"
          />
        </ScrollReveal>
      </div>
    </section>
  );
}
