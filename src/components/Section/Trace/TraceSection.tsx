import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { type ProjectProps, getProjects } from "../../../../script/projectsReader";

import "./TraceSection.css";

interface TraceProps extends ProjectProps {
  index: number;
  id?: string;
}

function Trace({ id, index, title, description, image }: TraceProps) {
  const newDescription = description.map((desc) => desc.replace(/%s/g, `${index + 1}`));
  const newImage = { ...image, legend: image.legend?.replace(/%s/g, `${index + 1}`) || "" };

  return (
    <div id={id} className="trace-section">
      <div className="trace-container">
        <h2 className="trace-title">{title}</h2>
        <div className="trace-image">
          <img className="trace-image" src={image.src} alt={image.alt} />
          {newImage.legend && <p className="trace-legend">{newImage.legend}</p>}
        </div>
        {newDescription.map((desc, index) => (
          <p className="trace-description" key={index}>
            {desc}
          </p>
        ))}
      </div>
    </div>
  );
}

const TraceAsync: React.FC<{ id?: string }> = ({ id }) => {
  const { id: projectId } = useParams<{ id: string }>();
  const [fetchedProjects, setFetchedProjects] = useState<ProjectProps[]>([]);
  const [error] = useState<string | null>(null);

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

  // console.log(projectId);
  const index = fetchedProjects.findIndex((project) => project.page === "/" + projectId);
  const project = fetchedProjects[index];

  if (!project) {
    return <div>Project not found</div>;
  }

  return <Trace id={id} index={index} {...(project as ProjectProps)} />;
};

function TraceSection({ id }: { id?: string }) {
  return <TraceAsync id={id} />;
}

export default TraceSection;
