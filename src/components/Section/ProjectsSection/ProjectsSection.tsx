import "./ProjectsSection.css";

import React, { useState, useEffect } from "react";
import { map } from "../../../../script/math";
import { getCenterPosition } from "../../../../script/utils";
import { type ProjectProps, getProjects } from "../../../../script/projectsReader";

function Project({ title, image, summary, page }: ProjectProps) {
  useEffect(() => {
    const projects = document.querySelectorAll(".project-container");
    const projectElements = Array.from(projects) as HTMLElement[];

    const handleScroll = () => {
      projectElements.forEach((project, i) => {
        const pos = getCenterPosition(project);
        const isOdd = i % 2;

        const translateX = map(pos.y, 0, window.innerHeight, 1.3, 0.7);
        const rotate = map(pos.y, window.innerHeight * 0.5, window.innerHeight, -0.25, 1.25);

        project.style.transform = `
          rotate(calc(var(--rotation-degree) * ${rotate} ${isOdd ? "* -1" : ""})) 
          translateX(calc(var(--position-translate) * ${translateX} ${isOdd ? "* -1" : ""}))
          `;
      });
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div className="project-container">
        {image && <img src={image.src} alt={image.alt} />}
        <div className="project-content">
          <span className="project-text">
            <h3>{title}</h3>
            {summary && <p>{summary}</p>}
          </span>
          <span className="project-link">
            <a href={"project" + page}>En savoir plus</a>
          </span>
        </div>
      </div>
    </>
  );
}

const ProjectsSectionAsync = () => {
  const [fetchedProjects, setFetchedProjects] = useState<ProjectProps[]>([]);
  const [error, ] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectsData = await getProjects();
        setFetchedProjects(projectsData);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();
  }, []);

  if (error) {
    return <div>Error fetching projects: {error}</div>;
  }

  if (!fetchedProjects.length) {
    return <div>Loading...</div>;
  }

  return (
      <div className="projects-container">
        {fetchedProjects.map((project) => (
          <Project key={project.title} {...project} />
        ))}
      </div>
  );
};

function ProjectsSection({ id }: { id?: string }) {
  return (
    <div id={id} className="projects-section">
      <ProjectsSectionAsync />
    </div>
  );
}

export default ProjectsSection;
