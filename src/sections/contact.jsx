import { ArrowUpRight, Send } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { SiGmail } from "react-icons/si";
import emailjs from "@emailjs/browser";
import { useState, useRef } from "react";
import ScrollReveal from "../components/ui/scroll-reveal";

function ContactForm() {
  const form = useRef(null);
  const [isSending, setIsSending] = useState(false);

  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  const sendEmail = (e) => {
    e.preventDefault();
    setIsSending(true);

    emailjs
      .sendForm(serviceId, templateId, form.current, publicKey)
      .then(() => {
        alert("Message sent successfully!");
        form.current.reset();
      })
      .catch(() => {
        alert("Failed to send message. Please try again.");
      })
      .finally(() => {
        setIsSending(false);
      });
  };
  return (
    <form className="w-full" ref={form} onSubmit={sendEmail}>
      <div className="space-y-8 sm:space-y-10">
        <div className="border-b border-border pb-3">
          <label
            htmlFor="contact-name"
            className="mb-2 block font-mono text-xs font-normal tracking-widest text-muted-foreground"
          >
            Name
          </label>
          <input
            id="contact-name"
            name="user_name"
            type="text"
            autoComplete="name"
            required
            placeholder="Your name"
            className="w-full bg-transparent py-1 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:placeholder:text-foreground/50"
          />
        </div>

        <div className="border-b border-border pb-3">
          <label
            htmlFor="contact-email"
            className="mb-2 block font-mono text-xs font-normal tracking-widest text-muted-foreground"
          >
            Email
          </label>
          <input
            id="contact-email"
            name="user_email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@company.com"
            className="w-full bg-transparent py-1 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:placeholder:text-foreground/50"
          />
        </div>

        <div className="border-b border-border pb-3">
          <label
            htmlFor="contact-message"
            className="mb-2 block font-mono text-xs font-normal tracking-widest text-muted-foreground"
          >
            Message
          </label>
          <textarea
            id="contact-message"
            name="message"
            rows={5}
            required
            placeholder="Describe your project or opportunity..."
            className="w-full resize-none bg-transparent py-1 text-sm leading-relaxed text-foreground outline-none placeholder:text-muted-foreground focus:placeholder:text-foreground/50"
          />
        </div>
      </div>

      <button
        type="submit"
        className="mt-10 inline-flex items-center gap-3 bg-primary px-6 py-3.5 text-sm text-primary-foreground transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        disabled={isSending}
      >
        {isSending ? "Sending..." : "Send Message"}
        <Send size={15} strokeWidth={1.5} />
      </button>
    </form>
  );
}
export default function Contact() {
  const socials = [
    {
      label: "GitHub",
      handle: "github.com/1nOnlyHans",
      href: "https://github.com/1nOnlyHans",
      Icon: FaGithub,
    },
    {
      label: "LinkedIn",
      handle: "in/hans-diaz",
      href: "https://www.linkedin.com/in/hans-diaz-680940415/",
      Icon: FaLinkedin,
    },
    {
      label: "Email",
      handle: "hansdiaz2356@gmail.com",
      href: "mailto:hansdiaz2356@gmail.com",
      Icon: SiGmail,
    },
  ];

  return (
    <section
      id="contact"
      className="portfolio-section grid grid-cols-1 items-start gap-10 md:grid-cols-2"
    >
      <ScrollReveal className="w-full" direction="right">
        <span className="section-label">04 / Contact</span>
        <h2 className="section-title">Have a project in mind?</h2>
        <p
          className="mt-6 text-muted-foreground mb-10"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 300,
            lineHeight: 1.8,
            fontSize: "1rem",
          }}
        >
          I'm available for freelance projects, full-time roles, and open-source
          collaboration. If you want to build something fast, clean, and
          production-ready — let's talk.
        </p>
        <div className="mt-6 flex flex-col space-y-4">
          {socials.map(({ label, handle, href, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              <Icon size={18} />
              <span>{handle}</span>
              <ArrowUpRight size={14} className="ml-auto" />
            </a>
          ))}
        </div>
      </ScrollReveal>
      <ScrollReveal direction="left" delay={0.15}>
        <ContactForm />
      </ScrollReveal>
    </section>
  );
}
