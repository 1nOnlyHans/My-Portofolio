import Navbar from "./components/layout/navbar";
import Footer from "./components/layout/footer";
import ScrollToTop from "./components/layout/scroll-to-top";
import Hero from "./sections/hero";
import About from "./sections/about";
import Contact from "./sections/contact";
import Projects from "./sections/projects";
import Skills from "./sections/skills";
import "./App.css";

function App() {
  return (
    <>
      <div className="mx-auto min-h-screen w-full max-w-5xl pt-18">
        <Navbar />
        <main className="scroll-sections">
          <Hero id="hero" />
          <About id="about" />
          <Projects id="projects" />
          <Skills id="skills" />
          <Contact id="contact" />
        </main>
        <Footer />
        <ScrollToTop />
      </div>
    </>
  );
}

export default App;
