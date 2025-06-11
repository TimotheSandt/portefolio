export interface ProjectProps {
  title: string;
  image: {
    src: string;
    alt: string;
    legend: string;
  };
  page: string;

  summary: string;
  description: string[];
}

export async function getProjects(): Promise<ProjectProps[]> {
  const response = await fetch("/public/trace/Projects.json");
  const data = await response.json();

  const dirImages = data.DirImages;
  const dirDescriptions = data.DirDescriptions;
  const projectsInfo = data.projects;

  const projects = await Promise.all(
    projectsInfo.map(async (projectInfo: any) => {
      try {
        const projectResponse = await fetch(dirDescriptions + projectInfo.src);
        const projectData = await projectResponse.json();
        projectData.image.src = dirImages + projectData.image.src;
        return projectData;
      } catch (error) {
        console.error(`Error fetching project data: ${error}`);
        throw error;
      }
    })
  );

  return projects;
}
