import Navbar from "./components/layout/navbar";
import Footer from "./components/layout/footer";
import ScrollToTop from "./components/layout/scroll-to-top";
import Hero from "./sections/hero";
import About from "./sections/about";
import Contact from "./sections/contact";
import Projects from "./sections/projects";
import Skills from "./sections/skills";
import Creative from "./sections/creative";
import Activity from "./sections/activity";
import Certifications from "./sections/certifications";
import "./App.css";

function App() {
  return (
    <>
      <div className="min-h-screen w-full overflow-x-clip pt-18 lg:pt-0 lg:pl-60">
        <Navbar />
        <main className="scroll-sections">
          <Hero id="hero" />
          <About id="about" />
          <Projects id="projects" />
          <Creative id="creative" />
          <Activity id="activity" />
          <Skills id="skills" />
          <Certifications id="certifications" />
          <Contact id="contact" />
        </main>
        <Footer />
        <ScrollToTop />
      </div>
    </>
  );
}

export default App;
