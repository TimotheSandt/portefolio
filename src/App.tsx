import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import NavBar, { type NavBarLink } from "./components/Section/NavBar/NavBar.tsx";
import Footer, { FooterTime } from "./components/Section/Footer/Footer.tsx";

import HomePage from "./pages/HomePage.tsx";
import TraceSection from "./components/Section/Trace/TraceSection.tsx";
import NotFoundPage from "./pages/NotFoundPage.tsx";
import AnimatedWave from "./components/Noise/AnimatedWave.tsx";
import { getCSSVariable } from "../script/utils.ts";
import { useEffect } from "react";

import { type ProjectProps, getProjects } from "../script/projectsReader";

function App() {
  const title: string = "Timothe Sandt";
  const links: NavBarLink[] = [
    { title: "Home", href: "/#welcome" },
    {
      title: "Projects",
      href: "/#projects",
      subLinks: getProjects().map((project: ProjectProps) => ({
        title: project.title,
        href: `/project${project.page}`,
      })),
    },
  ];

  useEffect(() => {
    const navbarHeight = document.querySelector(".navbar")?.getBoundingClientRect().height ?? 0;
    const footerHeight = document.querySelector("footer")?.getBoundingClientRect().height ?? 0;
    const notFoundPageHeight = `calc(100vh - ${navbarHeight + footerHeight - 4}px)`;

    document.documentElement.style.setProperty("--min-page-height", notFoundPageHeight);
  }, []);

  return (
    <>
      <BrowserRouter>
        <NavBar title={title} links={links} />
        <div
          style={{
            height: `max(${Math.max(
              document.querySelector(".navbar")?.getBoundingClientRect().height ?? 0,
              50
            )}px, 50px)`,
          }}
        />
        <main className="main">
          <Routes>  
            <Route path="/" Component={HomePage} />

            {getProjects().map((project: ProjectProps, index:number) => (
              <Route
                key={project.page}
                path={`/project${project.page}`}
                element={<TraceSection index={index} {...project} />}
              />
            ))}

            <Route path="*" Component={NotFoundPage} />
          </Routes>
        </main>
        <FooterTime />

        <Footer content="Timothe Sandt">
          <AnimatedWave
            fillDirection="below"
            height={50}
            amplitude={20}
            speed={0.003}
            frequency={0.003}
            color={getCSSVariable("--primary-color")}
            opacity={1}
          />
        </Footer>
      </BrowserRouter>
    </>
  );
}

export default App;
