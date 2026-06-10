import Navbar from "./components/layout/navbar";
import Footer from "./components/layout/footer";
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
        <main>
          <Hero />
          <About />
          <Projects />
          <Skills />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  );
}

export default App;
