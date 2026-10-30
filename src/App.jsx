import Navbar from "./components/layout/navbar";
import Footer from "./components/layout/footer";
import ScrollToTop from "./components/layout/scroll-to-top";
import Hero from "./sections/hero";
import About from "./sections/about";
import Contact from "./sections/contact";
import Journey from "./sections/journey";
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
          {/* visitor order: proof (work) > capability (skills) > person (about, journey) > credentials > extras > live signal > contact */}
          <Projects id="projects" />
          <Skills id="skills" />
          <About id="about" />
          <Journey />
          <Certifications id="certifications" />
          <Creative id="creative" />
          <Activity id="activity" />
          <Contact id="contact" />
        </main>
        <Footer />
        <ScrollToTop />
      </div>
    </>
  );
}

export default App;
