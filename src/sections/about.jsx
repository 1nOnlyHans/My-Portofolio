import hansPhoto from "../assets/images/hans.jpg";

export default function About() {
  return (
    <section id="about" className="portfolio-section">
        <div className="grid w-full gap-10 md:grid-cols-2 md:items-center lg:gap-16">
          <div className="max-w-3xl space-y-6">
            <span className="block text-sm text-mono uppercase text-muted-foreground font-light tracking-widest">
              About Me
            </span>
            <h2
              className="text-3xl tracking-tight text-foreground sm:text-4xl"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              Passionate Full-Stack Web Developer
            </h2>
            <p
              className="text-muted-foreground"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 300,
                lineHeight: 1.75,
                fontSize: "1rem",
                maxWidth: "420px",
              }}
            >
              With a strong foundation in both front-end and back-end
              technologies, I specialize in creating seamless and efficient web
              applications. My expertise includes PHP, Laravel, React, Vue.js,
              and MySQL, allowing me to build dynamic user interfaces and robust
              server-side solutions. Whether it's crafting responsive designs or
              optimizing server-side performance, I am dedicated to delivering
              high-quality results that exceed expectations.
            </p>
          </div>
          <div className="flex justify-center">
            <img
              src={hansPhoto}
              alt="Hans Diaz"
              className="w-120 h-120 rounded object-cover border-4 border-secondary"
            />
          </div>
        </div>
    </section>
  );
}
