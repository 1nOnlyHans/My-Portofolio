import { ArrowUpRight, Send } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { SiGmail } from "react-icons/si";
import emailjs from "@emailjs/browser";
import ReCAPTCHA from "react-google-recaptcha";
import { useEffect, useState, useRef } from "react";
import ScrollReveal from "../components/ui/scroll-reveal";

const MIN_FORM_FILL_TIME_MS = 3000;
const SUBMISSION_COOLDOWN_MS = 60000;
const LAST_SUBMISSION_KEY = "portfolio-contact-last-submission";

function ContactForm() {
  const form = useRef(null);
  const recaptcha = useRef(null);
  const isSendingRef = useRef(false);
  const formOpenedAt = useRef(0);
  const [isSending, setIsSending] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });

  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
  const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

  useEffect(() => {
    formOpenedAt.current = Date.now();
  }, []);

  const sendEmail = async (e) => {
    e.preventDefault();

    if (isSendingRef.current) return;

    const formData = new FormData(form.current);
    const name = String(formData.get("user_name") || "").trim();
    const email = String(formData.get("user_email") || "").trim();
    const message = String(formData.get("message") || "").trim();
    const honeypot = String(formData.get("website") || "").trim();

    // Bots commonly fill every field, including fields hidden from real users.
    if (honeypot) {
      setStatus({
        type: "success",
        message: "Message sent successfully. I'll get back to you soon.",
      });
      form.current.reset();
      return;
    }

    if (Date.now() - formOpenedAt.current < MIN_FORM_FILL_TIME_MS) {
      setStatus({
        type: "error",
        message: "Please take a moment to complete the form before sending.",
      });
      return;
    }

    const lastSubmission = Number(
      window.localStorage.getItem(LAST_SUBMISSION_KEY) || 0,
    );
    const cooldownRemaining = SUBMISSION_COOLDOWN_MS - (Date.now() - lastSubmission);

    if (cooldownRemaining > 0) {
      setStatus({
        type: "error",
        message: `Please wait ${Math.ceil(cooldownRemaining / 1000)} seconds before sending another message.`,
      });
      return;
    }

    if (name.length < 2 || message.length < 10) {
      setStatus({
        type: "error",
        message: "Please enter your name and a message of at least 10 characters.",
      });
      return;
    }

    if (!recaptchaToken) {
      setStatus({
        type: "error",
        message: "Please complete the reCAPTCHA verification.",
      });
      return;
    }

    if (!serviceId || !templateId || !publicKey || !recaptchaSiteKey) {
      setStatus({
        type: "error",
        message:
          "The contact form is not configured for this deployment. Please try again later.",
      });
      return;
    }

    isSendingRef.current = true;
    setIsSending(true);
    setStatus({ type: "", message: "" });

    try {
      const templateParams = {
        title: "New portfolio contact",
        user_name: name,
        user_email: email,
        message,
        "g-recaptcha-response": recaptchaToken,
      };

      await emailjs.send(serviceId, templateId, templateParams, {
        publicKey,
        blockHeadless: true,
        limitRate: {
          id: "portfolio-contact-form",
          throttle: SUBMISSION_COOLDOWN_MS,
        },
      });

      setStatus({
        type: "success",
        message: "Message sent successfully. I'll get back to you soon.",
      });
      window.localStorage.setItem(LAST_SUBMISSION_KEY, String(Date.now()));
      form.current.reset();
      formOpenedAt.current = Date.now();
    } catch (error) {
      console.error("EmailJS send failed:", error);
      setStatus({
        type: "error",
        message:
          error?.text || "Failed to send message. Please try again later.",
      });
    } finally {
      recaptcha.current?.reset();
      setRecaptchaToken("");
      isSendingRef.current = false;
      setIsSending(false);
    }
  };
  return (
    <form className="w-full" ref={form} onSubmit={sendEmail}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-[10000px] h-px w-px overflow-hidden"
      >
        <label htmlFor="contact-website">Website</label>
        <input
          id="contact-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
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
            minLength={2}
            maxLength={80}
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
            maxLength={254}
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
            minLength={10}
            maxLength={2000}
            placeholder="Describe your project or opportunity..."
            className="w-full resize-none bg-transparent py-1 text-sm leading-relaxed text-foreground outline-none placeholder:text-muted-foreground focus:placeholder:text-foreground/50"
          />
        </div>
      </div>

      <div className="mt-8 min-h-[78px] overflow-x-auto">
        {recaptchaSiteKey ? (
          <ReCAPTCHA
            ref={recaptcha}
            sitekey={recaptchaSiteKey}
            onChange={(token) => {
              setRecaptchaToken(token || "");
              if (token) setStatus({ type: "", message: "" });
            }}
            onExpired={() => setRecaptchaToken("")}
            onErrored={() => {
              setRecaptchaToken("");
              setStatus({
                type: "error",
                message: "reCAPTCHA could not load. Please refresh and try again.",
              });
            }}
          />
        ) : (
          <p className="text-sm text-red-500" role="alert">
            reCAPTCHA is not configured.
          </p>
        )}
      </div>

      <button
        type="submit"
        className="mt-10 inline-flex items-center gap-3 bg-primary px-6 py-3.5 text-sm text-primary-foreground transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        disabled={isSending || !recaptchaToken || !recaptchaSiteKey}
      >
        {isSending ? "Sending..." : "Send Message"}
        <Send size={15} strokeWidth={1.5} />
      </button>
      {status.message && (
        <p
          role="status"
          aria-live="polite"
          className={`mt-4 text-sm ${
            status.type === "success" ? "text-emerald-500" : "text-red-500"
          }`}
        >
          {status.message}
        </p>
      )}
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
