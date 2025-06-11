import WelcomeSection from "../components/Section/Welcome/WelcomeSection";
import ProjectsSection from "../components/Section/ProjectsSection/ProjectsSection";

function HomePage() {
  return (
    <>
      <WelcomeSection id="welcome" />
      <ProjectsSection id="projects" />
    </>
  );
}

export default HomePage;
